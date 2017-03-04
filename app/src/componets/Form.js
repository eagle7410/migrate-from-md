/**
 * Created by igor on 11.02.17.
 */
import React, { Component } from 'react';
import FieldGroup from './FieldGroup';
import { map, keys } from '../utils/Obj';
import { save } from '../utils/Req';

const prefix = window.base ? (window.base + '/') : '/';
const codes = {
	1 : 'No exists path',
	2 : 'No data in request',
	3 : 'No path in request',
	4 : 'No name space in request',
	5 : 'Bad structure for create',
	6 : 'Error in create content for files',
	7 : 'No saved files',
	8 : 'One or mare files not be saved'
};

import Marked from 'marked';
export default class Form extends Component {
	constructor(props) {
		super(props);
		let state = {};
		keys(this.props.elements).map(key => state[key] = '');
		state.markdown = '';
		this.state = state;
		map(this.props.elements, (id, val) => val.onChange = id === 'mdText'
			? this.handelChangeMdText.bind(this)
			: this.handelChangeInput.bind(this)
		);
	}

	_changeState(key, val) {
		let state = this.state;
		state[key] = val;
		return state;
	}

	handelChangeInput(ev) {
		let el = ev.target;
		this.state = this._changeState(el.id, el.value);
	}

	handelChangeMdText( ev ) {
		const markdown = ev.target.value;
		const tableNames = markdown.match(/__(.+)__/g);
		const isHaveTable = (tableNames || []).length;
		const mdText = document.getElementById('mdText');

		mdText.setCustomValidity(isHaveTable ? '' : 'Not search one table name! __TableName__');

		if (!isHaveTable) {
			return;
		}

		this._changeState('tableNames', tableNames);
		this.setState(this._changeState('markdown', markdown), () => this._changeState( 'struct', this._getStruct(mdText)));
	}

	handelSubmit(ev) {
		ev.preventDefault();
		let data = this.state;

		if (~data.path.indexOf('\\')) {
			data.path = data.path.replace(/\\/g, '/');
		}

		let ns = data.nameSpace;

		if (~ns.indexOf('/')) {
			ns = ns.replace(/\//g, '\\');
		}

		if (ns[0] === '\\') {
			ns = ns.substr(1);
		}

		data.nameSpace = ns;

		let  { nameSpace , path, struct } = data;

		save(prefix + 'migration', {
			path      : path,
			struct    : JSON.stringify(struct),
			nameSpace : nameSpace
		}).then(r => {
				let state = { success : false };

				if (r.status === 'OK') {
					state.sucess = true;

					if (r.noUsed && r.noUsed.length) {
						state.warn = r.noUsed;
					}


				} else {
					state.error = true;
					state.message = (r.code && codes[r.code]) ? codes[r.code] : 'Error saved.';
				}

				this.setState(state);
			},
			r => {
				this.setState({
					error : true,
					message : 'Bad response from server'
				});
				console.log('handelSubmit/Responce/Error', r);
			});
	}

	_cellText (cell) {
		return cell && cell.innerText ? cell.innerText : '';
	}

	_getStruct (element) {
		const contentView = document.getElementById('markDownName');
		const tbodyes = contentView.getElementsByTagName('tbody');
		let structs = [];

		for (let i = 0; i < tbodyes.length; ++i) {
			const tbody = tbodyes[i];
			const tableName = this.state.tableNames[i];

			if (!tableName) {
				return element.setCustomValidity('No all table no have name');
			}

			let struct = {rows : [], table : tableName, inx : i};

			for (let r = 0; r < tbody.rows.length; ++r) {
				const row = tbody.rows[r];
				struct.rows.push({
					colum : this._cellText(row.cells[0]),
					type : this._cellText(row.cells[1])
				});
			}

			structs.push(struct);
		}

		return structs;
	}

	warns () {
		if (!this.state.warn || !this.state.warn.length)
			return null;

		return map(this.state.warn, (table, row) => (
			<div class='alert alert-warning'>
			  <strong>Warning!</strong> No used colum {row.colum} in tabel {table}.
			</div>
		));
	}

	render() {
		let alerts = '';

		if (this.state.sucess) {
			alerts = (
					<div className='alert alert-success'>
						<strong>Success!</strong> Files created.
					</div>
				);
		} else if (this.state.error) {
			alerts = (
					<div className='alert alert-danger'>
						<strong>Error!</strong> {this.state.message}.
					</div>
				);
		}

		return (
			<div className='form' >
				{ alerts }
				{ this.warns() }
				<form onSubmit={ this.handelSubmit.bind(this) } id='formId' >
					<div className='col-lg-6' >
						{ map(this.props.elements, (id, vals) => <FieldGroup key={	id } id={ id } { ...vals } />) }
						<button id='submit' type='submit' className='btn btn-primary'>Submit</button>
					</div>
					<div className='col-lg-6' > <h3> Result markdown </h3>
						<div id='markDownName' dangerouslySetInnerHTML={{	__html: Marked(this.state.markdown)	}} />
					</div>
				</form>
			</div>
		);
	}
}
