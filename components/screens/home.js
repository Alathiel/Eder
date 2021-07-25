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
import SQLite from 'react-native-sqlite-2';
import {Picker} from '@react-native-picker/picker';
const db = SQLite.openDatabase('records.db', '1.0', '', 1);
var datas = [];

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
        };
		this.loadDatas();
    }

	forceRemount = () => {
        this.setState(({ reload }) => ({
          reload: reload + 1,
        }));
    }

	setDatas(){
		let name = this.state.name;
		let value = this.state.currency + this.state.value;
		console.log(name + "  " + value);
		let date = new Date();
		db.transaction(function (txn) {
			txn.executeSql("INSERT INTO 'records' VALUES('" + name + "','" + value + "'," + date.getDate() + "," + date.getUTCMonth() + "," + date.getFullYear() + ")",[]);
		});
		this.loadDatas();
	}

	getDatas(){
		return new Promise((resolve,regect) => {
			var rows = [];
			setTimeout(() => {
				db.transaction(function (txn) {
					txn.executeSql('SELECT * FROM `records`', [], function (tx, res) {
						var len = res.rows.length;
						for (let i = 0; i < len; i++) {
							let row = res.rows.item(i);
							rows [i] = row;
						}
					});
					resolve(rows);
				});
			}, 2000);
		});
	}

	async loadDatas(){
		datas = await this.getDatas()
		.catch((err) => { console.error(err); });
		this.forceRemount();
		this.setState({render:true});
		console.log(datas);
	}

	DynamicRender(){
		if(this.state.render){
			if(datas.length > 0){
				return(<>
					<ScrollView key={this.state.reload} locked={true} style={styles.list}>
						{
							datas.map((l, i) => (
								<>
								<View style={{flexDirection:'row', justifyContent: 'space-between',}}>
									<Text h4>{l.title}</Text>
									<Text>{l.value}</Text>
									<Text>{l.month}</Text>
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
					<View style={{justifyContent:'center', alignContent:'center'}}>
						<Text style={{fontSize:25}}>So Empty try to add something </Text>
					</View>
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
			<View style = {styles.container}>
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
