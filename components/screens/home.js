/* eslint-disable jsx-quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, ScrollView, ActivityIndicator, TouchableWithoutFeedback} from 'react-native';
import NavigationService from '../utils/NavigationService';
import styles from '../utils/style';
import {Divider, Icon, Overlay, Text, Input, Button} from 'react-native-elements';
const Realm = require('realm');
import {Picker} from '@react-native-picker/picker';
import {CarSchema} from '../utils/schemas';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            render: false,
			reload: 0,
			visible: false,
			error: false,
			name:'',
			value:'',
			currency:'',
			realm: null,
        };
		this.loadDatas();
    }

	forceRemount = () => {
        this.setState(({ reload }) => ({
          reload: reload + 1,
        }));
    }

	initRealm(){


		return new Promise((resolve,regect) => {
			setTimeout(() => {
		Realm.open({
			schema: [CarSchema]
		  }).then(realm => {
			resolve(this.setState({ realm:realm }));
		  });}, 2000);
		});
	}


	setDatas(){
		let name = this.state.name;
		let value = this.state.currency + this.state.value;
		console.log(name + "  " + value);
		let date = new Date();
		

		Realm.open({
			schema: [CarSchema]
		  }).then(realm => {
			realm.write(() => {
			  realm.create('Car', {make: name, model: value});
			});
			this.setState({ realm });
		  });
		this.loadDatas();
	}

	async loadDatas(){
		//datas = await this.getDatas()
		//.catch((err) => { console.error(err); });
		console.log('aa');
		await(this.initRealm());
		console.log(this.state.realm.objects('Car'));
		if (this.state.realm != null){
		this.forceRemount();
		this.setState({render:true});}
	}

	DynamicRender(){
		if(this.state.render){
			if(this.state.realm.objects('Car') != null){
				return(<>
					<ScrollView locked={true} style={styles.list}>
						{
							this.state.realm.objects('Car').map((l, i) => (
								<>
								<View key={i} style={{flexDirection:'row', justifyContent: 'space-between',}}>
									<Text h4>{l.model}   {i}</Text>
									<Text>{l.miles}</Text>
									<Text>{l.make}</Text>
								</View>
								<Divider/>
								</>
							))
						}
					</ScrollView>
					<View style={styles.fixedButton}>
					<TouchableWithoutFeedback onPress={() => this.setState({visible:true})}>
						<Icon name='pluscircle' type='antdesign'/>
					</TouchableWithoutFeedback>
				</View>
					</>
				);
			}
			else{
				return(
					<>
					<View style={{justifyContent:'center', alignContent:'center'}}>
						<Text style={{fontSize:25}}>So Empty try to add something </Text>
					</View>
					<View style={styles.fixedButton}>
					<TouchableWithoutFeedback onPress={() => this.setState({visible:true})}>
						<Icon name='pluscircle' type='antdesign'/>
					</TouchableWithoutFeedback>
				</View></>
				);
			}
		}

		else{
			return (
				<View style={{justifyContent:'center', alignContent:'center'}}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
			);
		}
	}

	render(){
		return(
			<View style = {styles.container} key={this.state.reload}>
				<Overlay isVisible={this.state.visible} onBackdropPress={() => this.setState({visible: false})} overlayStyle = {styles.overlay}>
					<Text h3 style={{textAlign:'center'}}>Add an expense</Text>
					<View style={{minWidth:'100%', paddingBottom:100}}>
						<Input
							placeholder='Expense name'
							label = 'Name'
							onChangeText={value => this.setState({ name:value})}
							containerStyle={{minWidth:'100%'}}
						/>
						<Input
							placeholder='Expense value'
							label = 'Value'
							errorStyle={{ color: 'red' }}
							errorMessage='ENTER A VALID VALUE'
							renderErrorMessage = {this.state.error}
							onChangeText={value => this.setState({ value:value})}
							containerStyle={{minWidth:'100%'}}
						/>
						<Picker selectedValue={this.state.currency}
							onValueChange={(itemValue, itemIndex) => {this.setState({ currency:itemValue});}}>
							<Picker.Item label="EUR" value="€" />
							<Picker.Item label="USD" value="$" />
						</Picker>
					</View>
					<Button title="Add"
						onPress={() => {
							this.setState({visible:false});
							this.setDatas();
						}}
					/>
      			</Overlay>
				{this.DynamicRender()}
			</View>
		);
	}

}
