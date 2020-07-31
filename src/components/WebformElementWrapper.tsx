import React from 'react'
import { DeNormalizedWebformElement } from '../Webform'

interface Props extends React.HTMLProps<HTMLDivElement> {
	element: DeNormalizedWebformElement
	labelFor?: string
	labelClassName?: string
	error?: string
}

/**
 * Return true if element title should be visually hidden.
 */
export function isTitleHidden(elementProperties: DeNormalizedWebformElement['additional_properties']) {
	return elementProperties ? elementProperties.title_display === 'invisible' : false
}

export function getTileStyle(elementProperties: DeNormalizedWebformElement['additional_properties']): React.CSSProperties | undefined {
	if (isTitleHidden(elementProperties)) {
		return {
			position: 'absolute',
			overflow: 'hidden',
			clip: 'rect(1px,1px,1px,1px)',
			width: '1px',
			height: '1px',
			wordWrap: 'normal'
		}
	}

	return undefined
}

export function getTitleDisplay(elementProperties: DeNormalizedWebformElement['additional_properties']): 'before' | 'after' {
	return elementProperties ? (elementProperties.title_display === 'after' ? 'after' : 'before') : 'before'
}

export function isElementHidden(states: DeNormalizedWebformElement['states']): boolean {
	return states ? states.invisible === true || states.visible === false : false
}

function classNames(list: Array<undefined | boolean | string>) {
	const className = list.filter(item => typeof item === 'string').join(' ')

	return className.length > 0 ? className : undefined
}

const ElementWrapper: React.FC<Props> = ({ children, element, error, labelFor, labelClassName, ...props }) => {
	const states = element.states
	const attributes = element.attributes || {}
	const elementProperties = element.additional_properties || {}
	const wrapperAttributes = element.wrapper_attributes || {}
	// Pass required prop here and add css class 'required' etc. to label.
	const wrapperClassList = ['form-group', error != null && 'is-invalid', props.className, wrapperAttributes.className]
	if (attributes.required) {
		wrapperClassList.push('required')
	}
	const wrapperClassNames = classNames(wrapperClassList)

	const labelAttributes = element.label_attributes || {}
	const labelClassNames = classNames([labelClassName, labelAttributes.className])

	if (states && isElementHidden(states)) {
		return <></>
	}

	const label = element.title ? (
		<label style={getTileStyle(elementProperties)} className={labelClassNames} htmlFor={labelFor}>
			{element.title}
		</label>
	) : '';

	return (
		<div {...props} className={wrapperClassNames}>
			{getTitleDisplay(elementProperties) === 'before' && label}

			{children}

			{getTitleDisplay(elementProperties) === 'after' && label}

			{error && (
				<div className="form-text invalid-feedback" {...props}>
					{error}
				</div>
			)}

			{attributes.description && (
				<div className="form-text description" {...props} dangerouslySetInnerHTML={{ __html: attributes.description }} />
			)}
		</div>
	)
}

export default ElementWrapper
