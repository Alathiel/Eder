/* eslint-disable jsx-quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
		View,
		PermissionsAndroid,
		ToastAndroid,
		Platform,
		AlertIOS,
	} from 'react-native';
import { List, Button, Icon} from 'react-native-paper';
import {} from 'react-native-elements'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
const Realm = require('realm');
import {ExpenseSchema} from '../utils/schemas';
import styles from '../utils/style';
var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



const expToPDF = async (options) => {
	try {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
			{
				title: "Write Permission",
				message: "This app needs write permissions to save PDF",
				buttonNeutral: "Ask Me Later",
				buttonNegative: "Cancel",
				buttonPositive: "OK",
			}
		);

		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			let file = await RNHTMLtoPDF.convert(options);

			if (Platform.OS === 'android') {
				ToastAndroid.show('Saved in '+file.filePath, ToastAndroid.SHORT);
			} else {
				AlertIOS.alert('Saved in '+file.filePath);
			}
		} else {
			if (Platform.OS === 'android') {
				ToastAndroid.show('Permission Denied', ToastAndroid.SHORT);
			} else {
				AlertIOS.alert('Permission Denied');
			}
		}
	} catch (err) {
		console.warn(err);
	}
};

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

	loadRealmDatas(){
		return new Promise((resolve,regect) => {
			setTimeout(() => {
				Realm.open({schema: [ExpenseSchema]})
				.then(realm => {
					resolve(this.setState({ realm:realm }));
				});}, 1000);
		});
	}

	generateHTML = async() =>{
		await this.loadRealmDatas();
		let html = '<style>table, th, td{border: 1px solid black;border-collapse: collapse;}table {width: 100%;}</style><h1>Expenses</h1>';
		this.state.realm.objects('Expense').filtered('TRUEPREDICATE SORT(year DESC) DISTINCT(year)').map((x, i) => {
			html = html + '</br> <h2>Expenses in ' + x.year + '</h2>';
			this.state.realm.objects('Expense').filtered('year = '+ x.year + ' SORT(month DESC) DISTINCT(month)').map((y, i) => {
				html = html + '<h3>' + months[y.month] + '</h3> <table> <tr> <th> Name </th> <th> Value </th> <th> Date </th> </tr>';
				this.state.realm.objects('Expense').filtered('month = '+ y.month + 'AND year = '+x.year+' SORT(cDate DESC)').map((z, i) => {
					html = html + '<tr><td> '+ z.name + '</td>' + '</br> <td>' + z.currency + z.value + '</td> <td>'+ months[z.month] +' '+ z.day +'</td></tr>';
				});
				html = html + '</table>';
			});
		});
		let options = {
			html: html,
			fileName: 'Expenses_List',
			directory: 'Download',
		};
		expToPDF(options);
	}

	render(){
		return(
			<View style = {styles.container}>
				<List.Section style={{minHeight:'100%',minWidth:'100%'}}>
					<List.Item
						title='Export datas to PDF'
						style={{paddingRight:30}}
						titleStyle={{fontSize:20,paddingLeft:10}}
						right={() => <Button icon='file-download' mode="contained" onPress={() => {this.generateHTML();}}>Export</Button>}
					/>
				</List.Section>
			</View>
		);
	}

}
