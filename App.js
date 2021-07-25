/* eslint-disable prettier/prettier */

import React from 'react';
import Navigator from './components/utils/navigator.js';
import SQLite from 'react-native-sqlite-2';

export default class App extends React.Component {
    constructor(props) {
		super(props);
		const db = SQLite.openDatabase('records.db', '1.0', '', 1);
		db.transaction(function (txn) {
			txn.executeSql('CREATE TABLE IF NOT EXISTS records(title VARCHAR(30),value VARCHAR(30),day integer(10), month integer(10), cYear integer(10))',[]);
			txn.executeSql("INSERT INTO 'records' VALUES('aa',10,6,2021)",[]);
			txn.executeSql("INSERT INTO 'records' VALUES('aa',10,6,2021)",[]);
			txn.executeSql("INSERT INTO 'records' VALUES('aa',10,6,2021)",[]);
		});
    }

	render() {
		return (
			<Navigator/>
		);
	}
}