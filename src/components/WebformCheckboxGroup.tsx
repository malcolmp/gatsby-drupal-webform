import React from 'react'

import { WebformComponent } from '..'
import { getOptionId, deNormalizeElement } from '../utils'

import WebformElementWrapper from './WebformElementWrapper'

export const WebformCheckboxGroup: WebformComponent = ({ element, error }) => {
	const el = deNormalizeElement(element, {
		className: 'form-check-input',
		name: element.name,
		type: element.type
	})

	const defaultValue = el.additional_properties.default_value

	return (
		<WebformElementWrapper element={el} error={error}>
			{el.options &&
				el.options.map(option => (
					<div className="form-check" key={option.value}>
						{/** Input for this option. */}
						<input
							id={getOptionId(el.name, option.value)}
							value={option.value}
							defaultChecked={defaultValue === option.value}
							{...el.attributes}
						/>

						{/** Label for this option. */}
						<label className="form-check-label" htmlFor={getOptionId(el.name, option.value)}>
							{option.label}
						</label>
					</div>
				))}
		</WebformElementWrapper>
	)
}

export default WebformCheckboxGroup
