/* eslint-disable react/self-closing-comp */
/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Text, Input, Button} from 'react-native-elements';
import NavigationService from '../utils/NavigationService';

const Realm = require('realm');
import {ExpenseSchema} from '../utils/schemas';
import styles from '../utils/style';
import { BackHandler } from 'react-native';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			nameErr:false,
            numErr:false,
			realm: null,
			name:'',
			value:'',
			currency:'',
        };
    }

	setDatas(){
		let name = this.state.name;
		let value = this.state.currency + this.state.value;
		let date = new Date();
		Realm.open({schema: [ExpenseSchema]})
		.then(realm => {
			realm.write(() => {
				realm.create('Expense', {name: name, value: value, day: date.getDate(), month: date.getUTCMonth(), year: date.getFullYear()});
			});
			this.setState({ realm });
		});
	}

	DynamicNameInput(){
		if(this.state.nameErr){
			return(
				<Input
					placeholder='Expense name'
					label = 'Name'
					errorStyle={{ color: 'red' }}
					errorMessage='ENTER A VALUE'
					renderErrorMessage = {this.state.nameError}
					onChangeText={value => this.setState({ name:value})}
					containerStyle={{minWidth:'100%'}}
				/>
			);
		}
		else{
			return(
				<Input
					placeholder='Expense name'
					label = 'Name'
					onChangeText={value => this.setState({ name:value})}
					containerStyle={{minWidth:'100%'}}
				/>
			);
		}
	}

	DynamicNumbInput(){
		if(this.state.numErr){
			return(
				<Input
					placeholder='Expense value'
					label = 'Value'
					errorStyle={{ color: 'red' }}
					errorMessage='ENTER A NUMERIC VALUE'
					renderErrorMessage = {this.state.numError}
					onChangeText={value => this.setState({ value:value})}
					containerStyle={{minWidth:'100%'}}
					keyboardType='numeric'
				/>
			);
		}
		else{
			return(
				<Input
					placeholder='Expense value'
					label = 'Value'
					renderErrorMessage = {this.state.error}
					onChangeText={value => this.setState({ value:value})}
					containerStyle={{minWidth:'100%'}}
					keyboardType='numeric'
				/>
			);
		}
	}

	render(){
		return(
			<View style = {styles.container}>
				<View style = {{maxHeight:'90%',minHeight:'80%', maxWidth:'90%' ,borderColor:'#eeee',borderWidth:1, justifyContent:'center', alignItems: 'center',}}>
					<Text h3 style={{textAlign:'center'}}>Add an expense</Text>
					<View style={{minWidth:'100%', paddingBottom:100}}>
						{this.DynamicNameInput()}
						{this.DynamicNumbInput()}
						<Picker selectedValue={this.state.currency}
						onValueChange={(itemValue, itemIndex) => {this.setState({currency: itemValue});}}>
							<Picker.Item label="EUR" value="€" />
							<Picker.Item label="USD" value="$" />
						</Picker>
					</View>

					<Button title="Add"
						containerStyle={{maxWidth:'50%', minWidth:'50%'}}
						onPress={() => {
							if(this.state.name === ''){
								this.setState({nameErr: true});
							}
							else if(isNaN(this.state.value)){
								this.setState({numErr: true});
							}
							else{
								this.setDatas();
							}
						}}
					/>
				</View>
			</View>
		);
	}

}
