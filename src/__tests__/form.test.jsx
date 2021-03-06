import React from 'react'
import { render } from '@testing-library/react'

import Webform from '../Webform'

const webform = {
	drupal_internal__id: 'contact',
	elements: [
		{
			name: 'name',
			type: 'textfield',
			attributes: [
				{
					name: '#title',
					value: 'Your Name'
				},
				{
					name: '#required',
					value: 'true'
				},
				{
					name: '#default_value',
					value: 'John'
				}
			]
		},
		{
			name: 'email',
			type: 'email',
			attributes: [
				{
					name: '#title',
					value: 'Your Email'
				},
				{
					name: '#required',
					value: 'true'
				},
				{
					name: '#default_value',
					value: 'john@example.com'
				}
			]
		},
		{
			name: 'subject',
			type: 'email',
			attributes: [
				{
					name: '#title',
					value: 'Subject'
				},
				{
					name: '#required',
					value: 'true'
				}
			]
		},
		{
			name: 'message',
			type: 'textarea',
			attributes: [
				{
					name: '#title',
					value: 'Subject'
				},
				{
					name: '#required',
					value: 'true'
				}
			]
		},
		{
			name: 'actions',
			type: 'webform_actions',
			attributes: [
				{
					name: '#title',
					value: 'Submit button(s)'
				},
				{
					name: '#submit__label',
					value: 'Send message'
				}
			]
		}
	]
}

describe('Webform', () => {
	it('contact form renders correctly', () => {
		const { asFragment } = render(<Webform className="my-form" style={{ color: 'black' }} endpoint="/form-submit" webform={webform} />)

		expect(asFragment()).toMatchSnapshot()
	})

	it('title attributes', () => {
		const webform = {
			drupal_internal__id: 'contact',
			elements: [
				{
					name: 'name',
					type: 'textfield',
					attributes: [
						{
							name: '#title',
							value: 'Your Name'
						},
						{
							name: '#title_display',
							value: 'invisible'
						}
					]
				}
			]
		}

		const { asFragment } = render(<Webform className="my-form" endpoint="/form-submit" webform={webform} />)

		expect(asFragment()).toMatchSnapshot()
	})

	it('hidden inputs', () => {
		const webform = {
			drupal_internal__id: 'contact',
			elements: [
				{
					name: 'name',
					type: 'hidden',
					attributes: [
						{
							name: '#title',
							value: 'Your Name'
						}
					]
				}
			]
		}

		const { asFragment } = render(<Webform className="my-form" endpoint="/form-submit" webform={webform} />)
		expect(asFragment()).toMatchSnapshot()
	})

	it('checkboxes', () => {
		const webform = {
			drupal_internal__id: 'contact',
			elements: [
				{
					name: 'tos',
					type: 'checkbox',
					attributes: [
						{
							name: '#title',
							value: 'Agree terms of service'
						}
					]
				},
				{
					name: 'favourite_color',
					type: 'radios',
					options: [
						{
							label: 'Hotpink',
							value: '#ff69b4'
						},
						{
							label: 'Olive',
							value: '#808000'
						},
						{
							label: 'Cornflower blue',
							value: '#6495ed'
						}
					],
					attributes: [
						{
							name: '#title',
							value: 'Select your favourite color'
						}
					]
				}
			]
		}

		const { asFragment } = render(<Webform className="my-form" endpoint="/form-submit" webform={webform} />)

		expect(asFragment()).toMatchSnapshot()
	})
})
