import { useEffect, useState } from 'react'
import { WebformElement, DeNormalizedWebformElement } from './Webform'

/** Item type of state property in webform element */
type State = Exclude<WebformElement['states'], undefined>[number]

/**
 * Check if form element passes webform state conditions.
 *
 * @param element controlling element
 * @param conditions webform conditions
 *
 * @return true if element passes all conditions
 */
function checkConditions(element: HTMLInputElement, conditions: State['condition']): boolean {
	return Object.entries(conditions).every(([condition, value]) => {
		// Value might be null if this condition is not defined for this state.
		// Return true indicates this condition is ignored.
		if (value == null) {
			return true
		}

		// Check condition:
		switch (condition) {
			case 'checked':
				return element.checked === true
			case 'unchecked':
				return element.checked === false
			case 'empty':
				return element.value === ''
			case 'filled':
				return element.value !== ''
			case 'value':
				if (element.type === 'checkbox' || element.type === 'radio') {
					return element.value === value && element.checked
				}

				return element.value === value
			default:
				return false
		}
	})
}

/**
 * Check if group of form element passes webform state conditions.
 *
 * @param element controlling elements
 * @param conditions webform conditions
 *
 * @return true if any element in the group passes all conditions
 */
function checkGroupConditions(elements: NodeListOf<HTMLInputElement>, conditions: State['condition']): boolean {
	for (let i = 0; i < elements.length; ++i) {
		const element = elements[i]

		// Return true if any element passes all conditions.
		if (checkConditions(element, conditions)) {
			return true
		}
	}

	return false
}

/**
 * Attempt to guess initial state.
 *
 * This is to have something for the initial render. This is an attempt to
 * reduce flickering and elements jumping around.
 *
 * Guesses:
 *  - If invisible|visible states are present assume they are used to initally hide.
 *
 * @param states
 */
function guessInitialState(states: State[]) {
	const initialState: DeNormalizedWebformElement['states'] = {}

	for (const state of states) {
		switch (state.state) {
			case 'invisible':
				initialState[state.state] = true
				break
			case 'visible':
			default:
				initialState[state.state] = false
				break
		}
	}

	return initialState
}

type UseStateCallback = (value: React.SetStateAction<{}>) => void

function handleOnChange(state: State, setState: UseStateCallback, event: Event) {
	const { state: stateName, condition } = state
	const element = event.currentTarget

	setState(prevState => ({
		...prevState,

		[stateName]: checkConditions(element as HTMLInputElement, condition)
	}))
}

export function useWebformStates(webformStates: State[]) {
	const [states, setStates] = useState(() => guessInitialState(webformStates))

	useEffect(() => {
		const initialState: typeof states = {}

		// Keep track of all elements and their callbacks so they can be cleaned.
		const callbacks: [HTMLElement, (event: Event) => void][] = []

		// This loop does nothing if webformStates is empty.
		for (const state of webformStates) {
			// Webform uses jQuery selector syntax. The selector is prefixed with ':input'.
			// Strip leading ':' and hope this will not break horribly. :)
			//
			// This does not work with textarea or select elements...
			//
			// https://api.jquery.com/input-selector/
			const selector = state.selector.substr(1)
			const elements = document.querySelectorAll<HTMLInputElement>(selector)

			// Compute initial value for each state.
			initialState[state.state] = checkGroupConditions(elements, state.condition)

			// Setup listener for state change.
			elements.forEach(element => {
				const callback = handleOnChange.bind(null, state, setStates)

				element.addEventListener('change', callback)

				callbacks.push([element, callback])
			})
		}

		// Set calculated initial state.
		if (Object.entries(initialState).length > 0) {
			setStates(initialState)
		}

		return () => {
			// Remove all callbacks.
			for (const [element, callback] of callbacks) {
				element.removeEventListener('change', callback)
			}
		}
	}, webformStates)

	return states
}
