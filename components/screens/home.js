/* eslint-disable jsx-quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, ScrollView, ActivityIndicator, TouchableWithoutFeedback, RefreshControl} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import { List } from 'react-native-paper';

const Realm = require('realm');
import {ExpenseSchema} from '../utils/schemas';
import styles from '../utils/style';
var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            render: false,
			reload: 0,
			realm: null,
			refresh: false,
        };
		this.loadRealmDatas = this.loadRealmDatas.bind(this);
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

	loadDatas = async () =>{
		this.setState({refresh: true});
		await this.loadRealmDatas();
		if (this.state.realm.objects('Expense') != null){
			this.forceRemount();
			this.setState({render:true, refresh: false});
		}
	}

	DynamicRender(){
		if(this.state.render){
			if(this.state.realm.objects('Expense').length > 0){
				return(<>
					<ScrollView locked={true} style={styles.list}
						refreshControl = { <RefreshControl refreshing={this.state.refresh} onRefresh={this.loadDatas}/>}
					>
						{
							this.state.realm.objects('Expense').filtered('TRUEPREDICATE SORT(year DESC) DISTINCT(year)').map((y, i) => (
								this.state.realm.objects('Expense').filtered('year=' + y.year + ' SORT(month DESC) DISTINCT(month)').map((x, i) => (
									<List.Section>
										<List.Subheader>Expenses in {months[x.month] + '	' + x.year}</List.Subheader>
										{
											this.state.realm.objects('Expense').filtered('month =' + x.month + ' AND year=' + y.year + ' SORT(cDate DESC)').map((l, ind) => (
												<List.Item
													title= {l.name}
													description= {l.currency + l.value}
													left={props => <Icon {...props} name='money-check-alt' type='font-awesome-5'  style = {styles.list_icon}/>}
													right={props => <Text style = {{paddingTop:10, textAlign:'center'}}>{months[l.month] + '\n' + l.day}</Text>}
													onPress={() => {}}
													onLongPress ={(value) => {console.log(value)}}
												/>
											))
										}
										<List.Subheader style={{textAlign:'right'}}>
											Total Spent {x.currency + this.state.realm.objects('Expense').filtered('month =' + x.month + ' AND year=' + y.year).sum('value')}
										</List.Subheader>
									</List.Section>
								))
							))
						}
					</ScrollView>
					<View style={styles.fixedButton}>
					<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('AddExpense')}>
						<Icon name='plus' type='font-awesome-5' size={15}/>
					</TouchableWithoutFeedback>
				</View>
					</>
				);
			}
			else{
				return(
					<>
					<View style={{justifyContent:'center', alignContent:'center', minHeight:'80%'}}>
						<ScrollView locked={true} style={{alignContent:'center',minHeight:'100%',minWidth:'90%'}}
							refreshControl = { <RefreshControl refreshing={this.state.refresh} onRefresh={this.loadDatas}/>}
						>
							<Text style={{fontSize:25}}>So Empty try to add something </Text>
						</ScrollView>
					</View>
					<View style={styles.fixedButton}>
					<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('AddExpense')}>
						<Icon name='plus' type='font-awesome-5' size={15}/>
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
