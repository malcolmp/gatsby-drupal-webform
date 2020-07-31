# Gatsby Drupal Webform

[![Build Status](https://travis-ci.org/malcolmp/gatsby-drupal-webform.svg?branch=master)](https://travis-ci.org/malcolmp/gatsby-drupal-webform)

React component for [webforms](https://www.drupal.org/project/webform). Goal of this project is to have a react component that generates [bootstrap like](https://getbootstrap.com/docs/4.0/components/forms/) HTML from webform YAML configuration.

This project is a fork of [gatsby-drupal-webform](https://github.com/oikeuttaelaimille/gatsby-drupal-webform) in order to handle a
more generic set of Webform element attributes, configurations, and custom elements.

## Summary of changes
* Created a distinction between attributes on the element `attributes`, label `label_attributes`, and wrapper 
`wrapper_attributes` and `additional_properties` which are other Drupal form element properties. This conforms more to 
how Drupal form elements represent attributes internally. 
* Element attribute values no longer contain drupal keys prefixed with '#'
* Renamed useWebformElement to deNormalizeElement returning a single object that takes attributes and other element 
properties from normalized objects of the format `{ key: String, value: String }` into key-value pairs.
* Created Graphql types & fragments for use in queries.

### Setup

* **Install Drupal dependencies [Webform REST](https://www.drupal.org/project/webform_rest) and [Webform JSON:API](https://www.drupal.org/project/webform_jsonapi)**.
* Enable REST resource "Webform Submit".
* **Give `access any webform configuration` permission to user [accessing](https://www.gatsbyjs.org/packages/gatsby-source-drupal/#basic-auth) Drupal jsonapi**.
* If your frontend is hosted on a different domain make sure browser has cross origin access to the Webform Submit REST resource using the [CORS module](https://www.drupal.org/project/cors).

```
npm install --save @umg/gatsby-drupal-webform
```

### Examples

* [Gatsby project](https://github.com/malcolmp/gatsby-drupal-webform/tree/master/examples/gatsby-webforms)
* [Drupal project](https://github.com/malcolmp/gatsby-drupal-webform/tree/master/examples/drupal)

```jsx
import Webfrom from 'gatsby-drupal-webform'

import { navigate } from 'gatsby'

const ContactForm = ({ data: { webformWebform: webform } }) => (
	<Webform
		webform={webform}
		endpoint="http://localhost:8888/webform_rest/submit"
		onSuccess={(response) => navigate(response.settings.confirmation_url)}
	/>
)

const query = graphql`
	query {
		webformWebform(drupal_internal__id: { eq: "contact" }) {
            id
            drupal_internal__id
            title
            status
			elements {
				...GatsbyDrupalWebformElement
			}
		}
	}

`
```

### Custom components

This module only provides basic components (textfield, number, textarea etc.) out of the box. More advanced webform components or composite components should be built as custom components. See: [WebformEntityRadios](https://github.com/oikeuttaelaimille/gatsby-drupal-webform/tree/master/examples/gatsby-webforms/src/components/WebformEntityRadios.jsx) for an example.

```jsx
import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { useWebformElement, WebformElementWrapper } from 'gatsby-drupal-webform'

const WebformEntityRadios = ({ element, error }) => {
	const {
		allTaxonomyTermTags: { nodes: tags }
	} = useStaticQuery(graphql`
		{
			allTaxonomyTermTags {
				nodes {
					drupal_internal__tid
					name
				}
			}
		}
	`)

	const denormalized = deNormalizeElement(element, {
		name: element.name,
		type: 'radio'
	})

	return (
		<WebformElementWrapper element={denormalized} error={error}>
			{tags.map(({ drupal_internal__tid: tid, name }) => (
				<div className="form-check" key={tid}>
					<inputid={`tags-${tid}`} className="form-check" defaultChecked={parseInt(inputProps.defaultValue, 10) === tid} {...denormalized.attributes} />
					<label htmlFor={`tags-${tid}`} className="form-check-radio">
						{name}
					</label>
				</div>
			))}
		</WebformElementWrapper>
	)
}

const SelectTagForm = () => (
	<Webform
		id="webform"
		webform={props.data.webformWebform}
		endpoint={config.env.ENDPOINT}
		customComponents={{
			webform_entity_radios: WebformEntityRadios
		}}
		onSuccess={() => {
			setSubmitted(true)
		}}
	/>
)

```
