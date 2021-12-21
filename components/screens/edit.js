/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, TouchableNativeFeedback} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Text, Icon} from 'react-native-elements';
import { TextInput, Button, Caption, HelperText} from 'react-native-paper';
import {currencies, categories, realm_version} from '../utils/constants';

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
			uuid : props.navigation.state.params.uuid,
			name: props.navigation.state.params.name,
			value: props.navigation.state.params.value,
			currency: props.navigation.state.params.currency,
			category: props.navigation.state.params.category
        };
    }

	componentDidMount() {
		this.props.navigation.setParams({ delete: this.delete });
	}

	static navigationOptions = ({navigation}) => {
		return{
			headerTitle: '',
			headerRight: () => (
				<TouchableNativeFeedback onPress={navigation.getParam('delete')}>
					<Icon name = "delete" type = "material-icons" style={{paddingRight:10}}/>
				</TouchableNativeFeedback>
			),
		};
	};

	delete = () =>{
		Realm.open({schema: [ExpenseSchema], schemaVersion: realm_version})
		.then(realm => {
			realm.write(() => {
				realm.delete(realm.objects('Expense').filtered("uuid = '" + this.state.uuid + "'"));
			});
		});
		this.props.navigation.goBack();
	}

	update(){
		Realm.open({schema: [ExpenseSchema], schemaVersion: realm_version})
		.then(realm => {
			let expenses = realm.objects('Expense');
			realm.write(() => {
				expenses.map((elem, index) => {
					if(elem.uuid == this.state.uuid){
						elem.name = this.state.name;
						elem.value = parseFloat(this.state.value);
						elem.currency = this.state.currency;
						elem.category = this.state.category;
					}
				});
			});
		});
		this.props.navigation.goBack();
	}

	render(){
		return(
			<View style = {styles.container}>
				<View style = {{maxHeight:'90%',minHeight:'80%', maxWidth:'90%', justifyContent:'center', alignItems: 'center',}}>
					<Text h3 style={{textAlign:'center', marginBottom:30}}>Edit expense</Text>
					<View style={{minWidth:'100%', paddingBottom:100}}>
						<View>
							<TextInput
								placeholder='Expense name'
								label = 'Name'
								style={{maxHeight:70, marginBottom:10}}
								onChangeText={value => this.setState({ name:value})}
								value = {this.state.name}
							/>
							<HelperText type="error" style={{marginBottom:10}} visible={this.state.nameErr}>Error insert a value here</HelperText>
						</View>

						<View>
							<TextInput
								placeholder='Expense value'
								label='Value'
								style={{maxHeight:70, marginBottom:10}}
								keyboardType='numeric'
								onChangeText={value => this.setState({ value: value})}
								value = {(this.state.value).toString()}
							/>
							<HelperText type="error" style={{marginBottom:10}} visible={this.state.numErr}>Error insert a value here</HelperText>
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
							console.log(this.state.name+'\n'+this.state.value)
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
								this.update();
						}}
					>
					Edit
					</Button>
				</View>
			</View>
		);
	}

}