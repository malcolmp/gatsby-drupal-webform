import React from 'react'

import { WebformComponent } from '..'
import { getElementId, deNormalizeElement } from '../utils'

import WebformElementWrapper from './WebformElementWrapper'

export const WebformCheckbox: WebformComponent = ({ element, error }) => {
	const id = getElementId(element.name)
	const el = deNormalizeElement(element, {
		className: 'form-check-input',
		name: element.name,
		type: element.type,
		// Single checkbox value should be '1'
		value: '1',
		id
	})
	const defaultValue = el.additional_properties.default_value

	/**
	 * For checkboxes title should be after the checkbox.
	 * This how I like to make custom checkboxes. :)
	 * @see https://www.w3schools.com/howto/howto_css_custom_checkbox.asp
	 */
	Object.assign(el.additional_properties || {}, { title_display: 'after' })

	return (
		<WebformElementWrapper element={el} error={error} className="form-check" labelClassName="form-check-label" labelFor={id}>
			<input defaultChecked={!!defaultValue} {...el.attributes} />
		</WebformElementWrapper>
	)
}

export default WebformCheckbox
