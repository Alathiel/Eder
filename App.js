/* eslint-disable prettier/prettier */

import React from 'react';
import Navigator from './components/utils/navigator.js';
import { migration } from './components/utils/migration.js';

export default class App extends React.Component {
    constructor(props) {
		super(props);
    }

	render() {
		return (
			<Navigator/>
		);
	}
}