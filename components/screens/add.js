/* eslint-disable react/self-closing-comp */
/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, BackHandler} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Text} from 'react-native-elements';
import { TextInput, Button, Caption, HelperText} from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import {categories,currencies, realm_version} from '../utils/constants';

const Realm = require('realm');
import {ExpenseSchema} from '../utils/schemas';
import styles from '../utils/style';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			nameErr:false,
            numErr:false,
			realm: null,
			name:'',
			value:'',
			currency:'€',
			category:'Other'
        };
    }

	static navigationOptions = {title: ''};

	setDatas(){
		let name = this.state.name;
		let value =  parseFloat(this.state.value);
		let currency = this.state.currency;
		let date = new Date();
		let category = this.state.category;
		Realm.open({schema: [ExpenseSchema], schemaVersion: realm_version})
		.then(realm => {
			realm.write(() => {
				realm.create('Expense',
				{uuid: uuidv4(), name: name, currency: currency, value: value, day: date.getDate(), month: date.getUTCMonth(), year: date.getFullYear(), cDate: date, category: category});
			});
		});
		this.props.navigation.goBack();
	}

	render(){
		return(
			<View style = {styles.container}>
				<View style = {{maxHeight:'90%',minHeight:'80%', maxWidth:'90%', justifyContent:'center', alignItems: 'center',}}>
					<Text h3 style={{textAlign:'center', marginBottom:30}}>Add an expense</Text>
					<View style={{minWidth:'100%', paddingBottom:100}}>
						<View>
							<TextInput
								placeholder='Expense name'
								label = 'Name'
								error = {this.state.nameError}
								style={{maxHeight:70, marginBottom:10}}
								onChangeText={value => this.setState({ name:value})}
							/>
							<HelperText type="error" style={{marginBottom:10}} visible={this.state.nameErr}>Error insert a value here</HelperText>
						</View>

						<View>
							<TextInput
								placeholder='Expense value'
								label = 'Value'
								error = {this.state.numError}
								style={{maxHeight:70, marginBottom:10}}
								onChangeText={value => this.setState({ value: value})}
								keyboardType='numeric'
							/>
							<HelperText type="error" style={{marginBottom:10}} visible={this.state.numErr} visible={this.state.numErr}>Error insert a value here</HelperText>
						</View>

						<Caption>Currency</Caption>
						<Picker selectedValue={this.state.currency}
						onValueChange={(itemValue, itemIndex) => {this.setState({currency: itemValue});}}>
							{currencies.map((x,i) => ( <Picker.Item label={x.label} value={x.value}/>))}
						</Picker>

						<Caption>Category</Caption>
						<Picker selectedValue={this.state.category}
						onValueChange={(itemValue, itemIndex) => {this.setState({category: itemValue});}}>
							{categories.map((x,i) => ( <Picker.Item label={x} value={x}/>))}
						</Picker>
					</View>

					<Button
						containerStyle={{maxWidth:'50%', minWidth:'50%'}}
						mode="contained"
						onPress={() => {
							if((this.state.name === '') && (isNaN(this.state.value) || this.state.value === '')){
								this.setState({nameErr: true});
								this.setState({numErr: true});
							}
							else if(this.state.name === ''){
								this.setState({nameErr: true});
								this.setState({numErr: false});
							}
							else if(isNaN(this.state.value) || this.state.value === ''){
								this.setState({numErr: true});
								this.setState({nameErr: false});
							}
							else
								this.setDatas();
						}}
					>
					Add Expense
					</Button>
				</View>
			</View>
		);
	}

}
