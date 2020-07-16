import React from 'react'
import { render } from '@testing-library/react'

import Webform from '../Webform'

const webform = {
	drupal_internal__id: 'contact',
	elements: [
		{
			name: 'name',
			title: 'Your Name',
			type: 'textfield',
			attributes: [
				{
					name: 'required',
					value: 'true'
				},
				{
					name: 'defaultValue',
					value: 'John'
				}
			]
		},
		{
			name: 'email',
			title: 'Your Email',
			type: 'email',
			attributes: [
				{
					name: 'required',
					value: 'true'
				},
				{
					name: 'defaultValue',
					value: 'john@example.com'
				},
				{
					name: 'autocomplete',
					value: 'email'
				}
			]
		},
		{
			name: 'subject',
			title: 'Subject',
			type: 'email',
			attributes: [
				{
					name: 'required',
					value: 'true'
				}
			]
		},
		{
			name: 'message',
			title: 'Subject',
			type: 'textarea',
			attributes: [
				{
					name: 'required',
					value: 'true'
				}
			]
		},
		{
			name: 'actions',
			title: 'Submit button(s)',
			type: 'webform_actions',
			additional_properties: [
				{
					name: 'submit__label',
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
					title: 'Your Name',
					type: 'textfield',
					additional_properties: [
						{
							name: 'title_display',
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
					title: 'Your Name',
					type: 'hidden',
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
					title: 'Agree terms of service',
					type: 'checkbox',
				},
				{
					name: 'favourite_color',
					title: 'Select your favourite color',
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
					]
				}
			]
		}

		const { asFragment } = render(<Webform className="my-form" endpoint="/form-submit" webform={webform} />)

		expect(asFragment()).toMatchSnapshot()
	})
})
