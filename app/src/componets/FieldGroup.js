/**
 * Created by igor on 11.02.17.
 */

import React from 'react';
import { ControlLabel, FormControl, HelpBlock, FormGroup } from 'react-bootstrap';

/**
 * Create field group.
 *
 * @method FieldGroup
 * @param  {*}           id
 * @param  {string}      label
 * @param  {null|string} help
 * @param  {function}    validationState
 * @param  {*}           props
 */
const FieldGroup = ({ id, label, help, validationState, ...props }) => {
	return (
		<FormGroup controlId={id} validationState={validationState} >
			<ControlLabel>{label}</ControlLabel>
			<FormControl {...props} />
			{help && <HelpBlock>{help}</HelpBlock>}
		</FormGroup>
	);
};

export default FieldGroup;
