import React from 'react'
import { WebformComponent } from '..'
import { getElementId, deNormalizeElement } from '../utils'
import WebformElementWrapper from './WebformElementWrapper'

export const WebformTextarea: WebformComponent = ({ element, error }) => {
	const id = getElementId(element.name)
	const el = deNormalizeElement(element, {
		className: 'form-control',
		name: element.name,
		id
	})

	return (
		<WebformElementWrapper element={el} error={error} labelFor={id}>
			<textarea {...el.attributes} />
		</WebformElementWrapper>
	)
}

export default WebformTextarea
