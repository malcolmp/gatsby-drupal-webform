import { graphql } from 'gatsby'

export const fragments = graphql`
	# Webform Elements
	fragment GatsbyDrupalWebformElement on WebformElement {
		name
		title
		type
		options {
			...GatsbyDrupalWebformOption
		}
		attributes {
			...GatsbyDrupalWebformAttribute
		}
		label_attributes {
			...GatsbyDrupalWebformAttribute
		}
		wrapper_attributes {
			...GatsbyDrupalWebformAttribute
		}
		states {
			...GatsbyDrupalWebformState
		}
		additional_properties {
			...GatsbyDrupalWebformAttribute
		}
	}

	fragment GatsbyDrupalWebformOption on WebformOption {
		label
		value
	}

	fragment GatsbyDrupalWebformAttribute on WebformAttribute {
		name
		value
	}

	fragment GatsbyDrupalWebformState on WebformState {
		state
		selector
		condition {
			...GatsbyDrupalWebformStateCondition
		}
	}

	fragment GatsbyDrupalWebformStateCondition on WebformStateCondition {
		disabled
		empty
		enabled
		filled
		required
		checked
		unchecked
		collapsed
		expanded
		collapsed
		visible
		invisible
		value
	}

	# Webform Node
	fragment GatsbyDrupalWebform on webform__webform {
		...GatsbyDrupalWebformAttrs
		elements {
			...GatsbyDrupalWebformElement
		}
	}

	fragment GatsbyDrupalWebformAttrs on webform__webform {
		title
		category
		status
		archive
		template
	}
`
