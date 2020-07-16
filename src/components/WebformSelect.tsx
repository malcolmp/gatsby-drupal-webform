import React from 'react'

import { WebformComponent } from '..'
import { getElementId, deNormalizeElement } from '../utils'

import WebformElementWrapper from './WebformElementWrapper'

export const DEFAULT_SELECT_LABEL = '-- Select --'

export const WebformSelect: WebformComponent = ({ element, error }) => {
	const id = getElementId(element.name)
	const el = deNormalizeElement(element, {
		className: 'form-control',
		name: element.name,
		id
	})

	const defaultValue = el.additional_properties.default_value || ''

	return (
		<WebformElementWrapper element={el} error={error} labelFor={id}>
			<select {...el.attributes} defaultValue={defaultValue}>
				{/** Render placeholder as first element */}
				<option value="" disabled>
					{el.attributes.placeholder || DEFAULT_SELECT_LABEL}
				</option>

				{el.options &&
					el.options.map(option => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
			</select>
		</WebformElementWrapper>
	)
}

export default WebformSelect
