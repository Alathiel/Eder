/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, TouchableNativeFeedback} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Text, Icon} from 'react-native-elements';
import { TextInput, Button} from 'react-native-paper';

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
		Realm.open({schema: [ExpenseSchema]})
		.then(realm => {
			realm.write(() => {
				realm.delete(realm.objects('Expense').filtered("uuid = '" + this.state.uuid + "'"));
			});
		});
		this.props.navigation.goBack();
	}

	update(){
		Realm.open({schema: [ExpenseSchema]})
		.then(realm => {
			let expenses = realm.objects('Expense');
			realm.write(() => {
				expenses.map((elem, index) => {
					if(elem.uuid == this.state.uuid){
						elem.name = this.state.name;
						elem.value = parseFloat(this.state.value);
						elem.currency = this.state.currency;
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
						<TextInput
							placeholder='Expense name'
							label = 'Name'
							style={{maxHeight:70, marginBottom:30}}
							onChangeText={value => this.setState({ name:value})}
							value = {this.state.name}
						/>

						<TextInput
							placeholder='Expense value'
							label='Value'
							style={{maxHeight:70, marginBottom:30}}
							keyboardType='numeric'
							onChangeText={value => this.setState({ value: value})}
							value = {(this.state.value).toString()}
						/>

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
								this.update();
							}
						}}
					>
					Edit
					</Button>
				</View>
			</View>
		);
	}

}