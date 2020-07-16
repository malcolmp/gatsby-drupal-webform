
exports.createSchemaCustomization = ({ actions, schema }) =>
{
	const {createTypes} = actions

	createTypes(`
		type webform__webform implements Node {
	    title: String
	    category: String
	    status: String
	    archive: Boolean
	    template: Boolean
	    elements: [WebformElement]
	  }
	  
	  type WebformElement {  
	    name: String
	    title: String
	    type: String
	    options: [WebformOption]
	    states: [WebformState]
	    attributes: [WebformAttribute]
	    label_attributes: [WebformAttribute]
	    wrapper_attributes: [WebformAttribute]
	    additional_properties: [WebformAttribute]
	  }
	    
	  type WebformOption {
	    label: String
	    value: String
	  }
	    
	  type WebformAttribute {
	    name: String
	    value: String
	  }
	    
	  type WebformState {
	    state: String!
	    selector: String!
	    condition: WebformStateCondition
	  }
	  
	  # @see https://www.drupal.org/docs/8/api/form-api/conditional-form-fields#statesproperty
	  type WebformStateCondition {
	    disabled: Boolean
	    empty: Boolean
	    enabled: Boolean
	    filled: Boolean
	    required: Boolean
	    checked: Boolean
	    unchecked: Boolean
	    collapsed: Boolean
	    expanded: Boolean
	    collapsed: Boolean
	    visible: Boolean
	    invisible: Boolean
	    value: String
	  }
	`)
}
