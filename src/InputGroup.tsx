import * as React from 'react'

import { classNames } from './utils'

import Input from './Input'

type InputProps = React.HTMLProps<HTMLInputElement>

interface Props extends InputProps {
	label?: string
	/** Help text */
	help?: string
	/** Invalid feedback */
	error?: string
}

const InputGroup: React.FunctionComponent<Props> = ({ children, className, ...props }) => (
	<Input className={classNames('form-input-group', className)} {...props}>
		<div className="group">{children}</div>
	</Input>
)

export default InputGroup
