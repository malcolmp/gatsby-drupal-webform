import React, { useState, FormEvent } from 'react'
import axios from 'axios'
import './fragments'

import { deNormalizeElement, formToJSON } from './utils'
import { WebformInput, WebformSelect, WebformTextarea, WebformCheckbox, WebformCheckboxGroup, WebformText } from './components'

export const DEFAULT_SUBMIT_LABEL = 'Submit'

/**
 * Webform object as returned from GraphQL query.
 */
export interface WebformObject {
	drupal_internal__id: string
	description: string
	status: string
	elements: WebformElement[]
}

/**
 * Webform element (e.g. text field input or submit button) as returned by GraphQL.
 */
export type WebformElement = {
	name: string
	title: string
	type: string
	attributes?: WebformElementAttribute[]
	label_attributes?: WebformElementAttribute[]
	wrapper_attributes?: WebformElementAttribute[]
	options?: Array<{
		label: string
		value: string
	}>
	states?: Array<{
		state: string
		selector: string
		condition: {
			[key: string]: boolean | string | null
		}
	}>
	additional_properties?: WebformElementAttribute[]
}

/**
 * A name value mapping of element attributes.
 */
export type WebformElementAttribute = {
	name: string
	value: string
}

/**
 * A de-normalized webform element.
 */
export type DeNormalizedWebformElement = {
	name: string
	title: string
	type: string
	attributes: {
		[key: string]: any
	}
	label_attributes: {
		[key: string]: any
	}
	wrapper_attributes: {
		[key: string]: any
	}
	options?: Array<{
		label: string
		value: string
	}>
	states?: {
		[key: string]: boolean
	}
	additional_properties: {
		[key: string]: any
	}
}

export type WebformComponentProps = {
	element: WebformElement
	error?: string
}

/**
 * Custom component for webform element
 */
export type WebformComponent = React.FC<WebformComponentProps>

export type WebformValidateHandler = (event: FormEvent<HTMLFormElement>) => boolean
export type WebformSubmitHandler = (
	data: ReturnType<typeof formToJSON>,
	event: FormEvent<HTMLFormElement>
) => void | boolean | Promise<void | boolean>

export type WebformSuccessHandler = (response: any, event: FormEvent<HTMLFormElement>) => void
export type WebformErrorHandler = (err: any, event: FormEvent<HTMLFormElement>) => void

export class WebformError extends Error {
	response: any

	constructor(response: any) {
		super()

		this.response = response
	}
}

/**
 * Errors returned by Drupal.
 */
type WebformErrors = {
	[name: string]: string
}

interface Props {
	id?: string
	className?: string
	style?: React.CSSProperties
	noValidate?: boolean

	webform: WebformObject

	onValidate?: WebformValidateHandler
	onSuccess?: WebformSuccessHandler
	onError?: WebformErrorHandler

	/**
	 * Called right before webform data is POSTed to the api.
	 *
	 * If callback returns false nothing is sent to the api.
	 */
	onSubmit?: WebformSubmitHandler

	/** Form POST endpoint. */
	endpoint: string

	/** Extra data to POST. */
	extraData?: object

	/** Provide custom components that handle specific webform elements. */
	customComponents: { [name: string]: WebformComponent }
}

/**
 * Render single webform element.
 */
export function renderWebformElement(element: WebformElement, error?: string, CustomComponent?: WebformComponent) {
	const customComponentAPI = {
		error
	}

	// Render using custom component if provided:
	if (CustomComponent) {
		return <CustomComponent element={element} {...customComponentAPI} />
	}

	// Otherwise select renderer based on element type:
	switch (element.type) {
		case 'textfield':
			return <WebformInput element={{ ...element, type: 'text' }} {...customComponentAPI} />
		case 'textarea':
			return <WebformTextarea element={element} {...customComponentAPI} />
		case 'tel':
		case 'number':
		case 'email':
		case 'hidden':
			return <WebformInput element={element} {...customComponentAPI} />
		case 'checkbox':
		case 'radio':
			/** Render single checkbox or radio element. */
			return <WebformCheckbox element={element} {...customComponentAPI} />
		case 'checkboxes':
			return <WebformCheckboxGroup element={{ ...element, type: 'checkbox' }} {...customComponentAPI} />
		case 'radios':
			return <WebformCheckboxGroup element={{ ...element, type: 'radio' }} {...customComponentAPI} />
		case 'select':
			return <WebformSelect element={element} {...customComponentAPI} />
		case 'processed_text':
			return <WebformText element={element} {...customComponentAPI} />
		// Submit button
		case 'webform_actions':
			const el = deNormalizeElement(element)
			const submitLabel = (el.additional_properties || {}).submit__label || DEFAULT_SUBMIT_LABEL
			return (
				<div className="form-group">
					<button type="submit">{submitLabel}</button>
				</div>
			)
		// Unknown element type -> render an empty string.
		default:
			return ''
	}
}

/**
 * Drupal webform react component.
 */
const Webform = ({ webform, customComponents, ...props }: Props) => {
	const [errors, setErrors] = useState<WebformErrors>({})

	const submitHandler: React.FormEventHandler<HTMLFormElement> = async event => {
		event.preventDefault()

		const target = event.currentTarget

		// Clear errors from previous submit.
		setErrors({})

		// Remove lingering css classes from previous submits.
		target.classList.remove('form-submitting', 'form-error', 'form-submitted')

		if ((!props.onValidate || props.onValidate(event)) && target.checkValidity()) {
			// Let css know that this form was validated and is being submitted.
			target.classList.add('was-validated', 'form-submitting')

			// Serialize form data.
			const data = formToJSON(target.elements)

			// Post process serialized data:
			// Some webform elements require specialized data formatting.
			for (const element of webform.elements) {
				if (data[element.name]) {
					switch (element.type) {
						case 'checkbox':
							data[element.name] = data[element.name][0]
							break
					}
				}
			}

			try {
				// If onSubmit returns false skip submitting to API.
				if (props.onSubmit && (await props.onSubmit(data, event)) === false) {
					target.classList.replace('form-submitting', 'form-submitted')
					return
				}

				// Submit form to API.
				const response = await axios.post(props.endpoint, {
					...props.extraData,
					...data,
					webform_id: webform.drupal_internal__id
				})

				if (response.data.error) {
					throw new WebformError(response)
				}

				// Convey current form state.
				target.classList.replace('form-submitting', 'form-submitted')
				props.onSuccess && props.onSuccess(response.data, event)
			} catch (err) {
				// API should return error structure if validation fails.
				// We use that to render error messages to the form.
				if (err.response && err.response.data.error) {
					setErrors(err.response.data.error)
				}

				// Convey current form state.
				target.classList.replace('form-submitting', 'form-error')
				props.onError && props.onError(err, event)
			}
		} else {
			// Let css know this form was validated.
			target.classList.add('was-validated', 'form-error')
		}
	}

	return (
		<form
			onSubmit={submitHandler}
			id={props.id}
			className={props.className}
			style={props.style}
			noValidate={props.noValidate}
			data-webform-id={webform.drupal_internal__id}
		>
			{/* Render webform elements */}
			{webform.elements.map(element => (
				<React.Fragment key={element.name}>
					{renderWebformElement(element, errors[element.name], customComponents![element.type])}
				</React.Fragment>
			))}

			{/* Render default submit button if it is not defined in elements array. */}
			{webform.elements.find(element => element.type === 'webform_actions') === undefined && (
				<button type="submit">{DEFAULT_SUBMIT_LABEL}</button>
			)}
		</form>
	)
}

Webform.defaultProps = {
	customComponents: {}
}

export default Webform
