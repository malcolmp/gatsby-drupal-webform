import React from 'react'

import { WebformComponent } from '..'

import WebformElementWrapper from './WebformElementWrapper'
import { deNormalizeElement } from '../utils'

export const WebformText: WebformComponent = ({ element, error }) => {
	const el = deNormalizeElement(element, {})
	return (
		<WebformElementWrapper element={el} error={error}>
			<div dangerouslySetInnerHTML={{ __html: el.additional_properties.markup || '' }} />
		</WebformElementWrapper>
	)
}

export default WebformText
