/* eslint-disable jsx-quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
		View,
		ScrollView,
		ActivityIndicator,
		TouchableWithoutFeedback,
		RefreshControl,
		ToastAndroid,
		AlertIOS,
		Platform,
		Image,
	} from 'react-native';
import {Icon, Text, Divider} from 'react-native-elements';
import { List, Button, Card, Title} from 'react-native-paper';

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

	/*static navigationOptions = ({navigation}) => {
		return{
			headerTitle: '',
			headerLeft: () => (
				<Text>Eder</Text>
			),
		};
	};*/

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
					<ScrollView locked={true} style={styles.list} stickyHeaderIndices={[0]}
						refreshControl = { <RefreshControl refreshing={this.state.refresh} onRefresh={this.loadDatas}/>}
					>
						<Card containerStyle={{borderRadius:30}}>
							<Card.Content>
								<Title>Total spent in {(new Date).getFullYear()}: {this.state.realm.objects('Expense')[0].currency}{parseFloat(this.state.realm.objects('Expense').filtered('year =' + (new Date).getFullYear()).sum('value')).toFixed(2)}</Title>
							</Card.Content>
							<Card.Actions style={{flexDirection: "row-reverse",}}>
								<Button onPress = {() => {this.props.navigation.navigate('Expenses_list')}}>View More</Button>
							</Card.Actions>
						</Card>
						{
							this.state.realm.objects('Expense').filtered('year=' + (new Date).getFullYear() + ' SORT(month DESC) DISTINCT(month)').map((x, i) => (
								<List.Section>
									<List.Subheader>Expenses in {months[x.month] + '	' + x.year}</List.Subheader>
									{
										this.state.realm.objects('Expense').filtered('month =' + x.month + ' AND year=' + x.year + ' SORT(cDate DESC)').map((l, ind) => (
											<List.Item
												title= {l.name}
												description= {l.currency + l.value}
												left={props => <Icon {...props} name='money-check-alt' type='font-awesome-5'  style = {styles.list_icon}/>}
												right={props => <Text style = {{paddingTop:10, textAlign:'center'}}>{months[l.month] + '\n' + l.day}</Text>}
												onPress={() => {
													try{
														this.props.navigation.navigate('EditExpense', {uuid: l.uuid, name: l.name, value: l.value, currency: l.currency});
													}catch(error){
														if (Platform.OS === 'android') {
															ToastAndroid.show('The Expense not exist, try to reload', ToastAndroid.SHORT);
														} else {
															AlertIOS.alert('The Expense not exist, try to reload');
														}
													}
												}}
												onLongPress ={(value) => {console.log(value)}}
											/>
										))
									}
									<List.Subheader style={{textAlign:'right'}}>
										Total Spent {x.currency + parseFloat(this.state.realm.objects('Expense').filtered('month =' + x.month + ' AND year=' + x.year).sum('value')).toFixed(2)}
									</List.Subheader>
									<Divider/>
								</List.Section>
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
						<ScrollView locked={true} style={{alignContent:'center',minHeight:'100%',minWidth:'90%'}} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems:'center'}}
							refreshControl = { <RefreshControl refreshing={this.state.refresh} onRefresh={this.loadDatas}/>}
						>
							<Image source ={require('../assets/tiger.png')}/>
							<Text style={{fontSize:20}}>It feels so empty</Text>
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
