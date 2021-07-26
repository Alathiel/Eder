/* eslint-disable jsx-quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, ScrollView, ActivityIndicator, TouchableWithoutFeedback} from 'react-native';
import {Divider, Icon, Text} from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';
const Realm = require('realm');
import {ExpenseSchema} from '../utils/schemas';
import styles from '../utils/style';
import { List } from 'react-native-paper';
var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            render: false,
			reload: 0,
			realm: null,
        };
		this.loadDatas();
    }

	forceRemount = () => {
        this.setState(({ reload }) => ({
          reload: reload + 1,
        }));
    }

	loadRealmDatas(){
		return new Promise((resolve,regect) => {
			setTimeout(() => {
				Realm.open({schema: [ExpenseSchema]})
				.then(realm => {
					resolve(this.setState({ realm:realm }));
				});}, 2000);
		});
	}


	async loadDatas(){
		await (this.loadRealmDatas());
		if (this.state.realm.objects('Expense') != null){
			this.forceRemount();
			this.setState({render:true});
		}
	}

	DynamicRender(){
		if(this.state.render){
			if(this.state.realm.objects('Expense').length > 0){
				return(<>
					<ScrollView locked={true} style={styles.list}>
						<List.Section>
							<List.Subheader>Expenses in {months[new Date().getMonth()]}</List.Subheader>
							{
								this.state.realm.objects('Expense').filtered('month = ' + new Date().getUTCMonth()).map((l, i) => (
									/*<View style={{minWidth:'100%',maxWidth:'100%',minHeight:'5%'}}>
										<View key={i} style={{flexDirection:'row', justifyContent: 'space-between',}}>
											<Text h4>{l.name}</Text>
											<Text>{l.value}</Text>
											<Text>{l.day}</Text>
										</View>
										<Divider/>
									</View>*/
										<List.Item
											title= {l.name}
											description= {l.value}
											left={props => <List.Icon {...props} icon="folder" />}
											right={props => <Text>{l.day}</Text>}
											onPress={() => {}}
											onLongPress ={(value) => {console.log(value)}}
										/>
								))
							}
						</List.Section>
					</ScrollView>
					<View style={styles.fixedButton}>
					<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('AddExpense')}>
						<Icon name='pluscircle' type='antdesign'/>
					</TouchableWithoutFeedback>
				</View>
					</>
				);
			}
			else{
				return(
					<>
					<View style={{justifyContent:'center', alignContent:'center', minHeight:'80%'}}>
						<Text style={{fontSize:25}}>So Empty try to add something </Text>
					</View>
					<View style={styles.fixedButton}>
					<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('AddExpense')}>
						<Icon name='pluscircle' type='antdesign'/>
					</TouchableWithoutFeedback>
				</View></>
				);
			}
		}

		else{
			return (
				<View style={{justifyContent:'center', alignContent:'center', minHeight:'80%'}}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                </View>
			);
		}
	}

	render(){
		return(
			<View style = {styles.container} key={this.state.reload}>
				{this.DynamicRender()}
			</View>
		);
	}

}
