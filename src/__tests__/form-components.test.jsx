import React from 'react'

import { render } from '@testing-library/react'

import {WebformElementWrapper, useWebformElement, deNormalizeElement} from '..'

describe('Element wrapper', () => {
	it('element wrapper renders correctly', () => {
		const element = {
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
		}

		const TestComponent = () => {
			const denormalized = deNormalizeElement(element);
			return <WebformElementWrapper element={denormalized} error={undefined} />
		}

		const { container, queryByText } = render(<TestComponent />)

		// query* functions will return the element or null if it cannot be found
		expect(queryByText('Your Name')).not.toBeNull()

		// Should have css class when error parameter is defined.
		expect(container.firstChild.classList.contains('form-group')).toBe(true)
	})

	it('error messages render correctly', () => {
		const element = {
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
		}

		const testError = 'This field is required'
		const TestComponent = () => {
			const denormalized = deNormalizeElement(element);
			return <WebformElementWrapper element={denormalized} error={testError} />
		}

		const { container, queryByText } = render(<TestComponent />)

		// query* functions will return the element or null if it cannot be found
		expect(queryByText(testError)).not.toBeNull()

		// Should have css class when error parameter is defined.
		expect(container.firstChild.classList.contains('is-invalid')).toBe(true)
	})

	it('element wrapper class attributes render correctly', () => {
		const element = {
			type: 'number',
			title: 'Test number',
			name: 'amount',
			attributes: [
				{
					name: 'class',
					value: 'my-element-class'
				},
				{
					name: 'placeholder',
					value: 'Your favourite number'
				}
			],
			label_attributes: [
				{
					name: 'class',
					value: 'my-label-class'
				}
			],
			wrapper_attributes: [
				{
					name: 'class',
					value: 'my-wrapper-class'
				}
			]
		}

		const TestComponent = () => {
			const denormalized = deNormalizeElement(element);
			return <WebformElementWrapper element={denormalized} error={undefined} className="custom-class" />
		}

		const { container, queryByText } = render(<TestComponent />)

		// query* functions will return the element or null if it cannot be found
		const labelElement = queryByText('Test number')
		// const inputElement = queryByPlaceholderText('Your favourite number')

		// query* functions will return the element or null if it cannot be found
		expect(labelElement).not.toBeNull()
		expect(labelElement.classList.contains('my-label-class')).toBe(true)

		// Input in not rendered in this test
		// expect(inputElement).not.toBeNull()
		// expect(inputElement.classList.contains('form-control my-element-class')).toBe(true)

		// Should have css class when error parameter is defined.
		expect(container.firstChild.classList.contains('form-group')).toBe(true)
		expect(container.firstChild.classList.contains('custom-class')).toBe(true)
		expect(container.firstChild.classList.contains('my-wrapper-class')).toBe(true)
	})
})
