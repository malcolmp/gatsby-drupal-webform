import { WebformElement, WebformElementAttribute, DeNormalizedWebformElement } from './Webform'
import { formToJSON } from './formToJSON'
import { useWebformStates } from './states'

// Re-export
export { formToJSON }

type Attributes = { [key: string]: any }

/**
 * Helper to get a property given a type.
 *
 * @param o
 * @param name
 */
function getProperty<T, K extends keyof T>(o: T, name: K) {
	return o[name]
}

/**
 * Helper to set a property given a type.
 *
 * @param o
 * @param name
 * @param value
 */
function setProperty<T, K extends keyof T>(o: T, name: K, value: T[K]) {
	o[name] = value
}

/**
 * Transform attribute names into React / JS DOM compatible camelCased keys.
 *
 * @todo Is there was a way to do this without hard-coding?
 *
 * @param name
 *   The html dom attribute name.
 */
function transformAttributeName(name: string): string {
	switch (name) {
		case 'class':
			return 'className'
		case 'autocomplete':
			return 'autoComplete'
		default:
			return name
	}
}

/**
 * Denormalize the element into a format supporting arbitrary attributes,
 *
 * @param element webform element
 * @param options override default element properties
 */
export function deNormalizeElement(element: WebformElement, options?: { [key: string]: any }): DeNormalizedWebformElement {
	const denormalized = {} as Partial<DeNormalizedWebformElement>
	// Reformat element fields from [name: string, value: any] to [key: string]: any
	const stringKeys = ['name', 'title', ' type', 'options'] as Array<keyof DeNormalizedWebformElement>
	stringKeys.forEach((name: keyof DeNormalizedWebformElement) => {
		const property = getProperty(element, name) as string
		setProperty(denormalized, name, property)
	})

	denormalized.states = useWebformStates(element.states || [])

	const attrKeys = ['attributes', 'label_attributes', 'wrapper_attributes', 'additional_properties'] as Array<
		keyof WebformElement & DeNormalizedWebformElement
	>
	attrKeys.forEach((name: keyof WebformElement & DeNormalizedWebformElement) => {
		const attributes = {} as Partial<Attributes>
		const property = getProperty(element, name) as WebformElementAttribute[]
		if (property) {
			property.forEach((prop: WebformElementAttribute) => {
				const propName: string = transformAttributeName(prop.name),
					value: string | boolean = prop.value
				attributes[propName] = value === 'true' || value === '1' ? true : value === 'false' ? false : value
			})
		}
		if (options && name === 'attributes') {
			// Overwrite elementAttributes with option props.
			if (options.className && attributes.className) {
				options.className = [options.className, attributes.className].join(' ')
			}
			Object.assign(attributes, options)
		}
		setProperty(denormalized, name, attributes)
	})

	return denormalized as DeNormalizedWebformElement
}

/**
 * Generate the id for a form option element.
 *
 * @param name
 * @param value
 */
export function getOptionId(name: string, value: string) {
	return `form-${name}-${value.toLowerCase()}`.replace(/[_\s]/g, '-')
}

/**
 * Generate the id for a form element.
 *
 * @param name element name
 */
export function getElementId(name: string) {
	return `form-${name}`.replace(/[_\s]/g, '-')
}
