/* eslint-disable react/self-closing-comp */
/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, BackHandler} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Text} from 'react-native-elements';
import { TextInput, Button} from 'react-native-paper';
import { StackActions } from '@react-navigation/native';
import NavigationService from '../utils/NavigationService';
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
        };
    }

	static navigationOptions = {title: ''};

	setDatas(){
		let name = this.state.name;
		let value =  parseFloat(this.state.value);
		let currency = this.state.currency;
		let date = new Date();
		Realm.open({schema: [ExpenseSchema]})
		.then(realm => {
			realm.write(() => {
				realm.create('Expense', {name: name, currency: currency, value: value, day: date.getDate(), month: date.getUTCMonth(), year: date.getFullYear(), cDate: date});
			});
		});
		this.props.navigation.goBack();
	}

	DynamicNameInput(){
		if(this.state.nameErr){
			return(
				<TextInput
					placeholder='Expense name'
					label = 'Name'
					error = {this.state.nameError}
					style={{maxHeight:70, marginBottom:30}}
					onChangeText={value => this.setState({ name:value})}
				/>
			);
		}
		else{
			return(
				<TextInput
					placeholder='Expense name'
					label = 'Name'
					style={{maxHeight:70, marginBottom:30}}
					onChangeText={value => this.setState({ name:value})}
				/>
			);
		}
	}

	DynamicNumbInput(){
		if(this.state.numErr){
			return(
				<TextInput
					placeholder='Expense value'
					label = 'Value'
					error = {this.state.numError}
					style={{maxHeight:70, marginBottom:30}}
					onChangeText={value => this.setState({ value: value})}
					keyboardType='numeric'
				/>
			);
		}
		else{
			return(
				<TextInput
					placeholder='Expense value'
					label='Value'
					style={{maxHeight:70, marginBottom:30}}
					keyboardType='numeric'
					onChangeText={value => this.setState({ value: value})}
				/>
			);
		}
	}

	render(){
		return(
			<View style = {styles.container}>
				<View style = {{maxHeight:'90%',minHeight:'80%', maxWidth:'90%', justifyContent:'center', alignItems: 'center',}}>
					<Text h3 style={{textAlign:'center', marginBottom:30}}>Add an expense</Text>
					<View style={{minWidth:'100%', paddingBottom:100}}>
						{this.DynamicNameInput()}
						{this.DynamicNumbInput()}

						<Picker selectedValue={this.state.currency}
						onValueChange={(itemValue, itemIndex) => {this.setState({currency: itemValue});}}>
							<Picker.Item label="EUR" value="€" />
							<Picker.Item label="USD" value="$" />
						</Picker>
					</View>

					<Button
						containerStyle={{maxWidth:'50%', minWidth:'50%'}}
						mode="contained"
						onPress={() => {
							if(this.state.name === ''){
								this.setState({nameErr: true});
							}
							else if(isNaN(this.state.value) || this.state.value === ''){
								this.setState({numErr: true});
							}
							else{
								this.setDatas();
							}
						}}
					>
					Add Expense
					</Button>
				</View>
			</View>
		);
	}

}
