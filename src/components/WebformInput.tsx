import React from 'react'

import { WebformComponent } from '..'
import { getElementId, deNormalizeElement } from '../utils'

import WebformElementWrapper from './WebformElementWrapper'

export const WebformInput: WebformComponent = ({ element, error }) => {
	// todo: Maybe id attributes and settings should be generated one lever higher = less boilerplate.
	const id = getElementId(element.name)
	const el = deNormalizeElement(element, {
		className: 'form-control',
		name: element.name,
		type: element.type,
		id
	})

	if (element.type === 'hidden') {
		return <input {...el.attributes} />
	}

	return (
		<WebformElementWrapper element={el} error={error} labelFor={id}>
			<input {...el.attributes} />
		</WebformElementWrapper>
	)
}

export default WebformInput
