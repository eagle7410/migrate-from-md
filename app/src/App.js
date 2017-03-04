import React, { Component } from 'react';
import './App.css';
import AppHead from './componets/AppHead';
import Form from './componets/Form';

const formProps = {
	elements: {
		path: {
			type: 'text',
			label: 'Path insert',
			placeholder: 'Enter path',
			validationState: null,
			required : 'required'
		},
		nameSpace: {
			type: 'text',
			label: 'Name space',
			placeholder: 'Enter text',
			validationState: null,
			required : 'required'
		},
		mdText : {
			type : 'textarea',
			rows : 20,
			label: 'Markdown text',
			componentClass : 'textarea',
			placeholder : 'textarea',
			validationState: null,
			required : 'required'
		}
	},
	markdown : ''
};


class App extends Component {
	render() {
		return (
			<div className='App'>
				<AppHead/>

				<div className='App-body container'>
					<div className='row'>
						<Form {...formProps}/>
					</div>

				</div>
			</div>
		);
	}
}

export default App;
