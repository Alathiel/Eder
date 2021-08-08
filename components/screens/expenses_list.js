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

export default class expenses_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            render: false,
			realm: null,
        };
		this.loadDatas();
    }


	loadRealmDatas(){
		return new Promise((resolve,regect) => {
			setTimeout(() => {
				Realm.open({schema: [ExpenseSchema]})
				.then(realm => {
					resolve(this.setState({ realm:realm }));
				});}, 1000);
		});
	}

	loadDatas = async () =>{
		await this.loadRealmDatas();
		if (this.state.realm.objects('Expense') != null){
			this.setState({render:true});
		}
	}

	DynamicRender(){
		if(this.state.render){
				return(<>
					<ScrollView locked={true} style={styles.list}>
						{
							this.state.realm.objects('Expense').filtered('TRUEPREDICATE SORT(year DESC) DISTINCT(year)').map((x, i) => (
								<View key={i} style = {{paddingBottom:10}}>
								<Card>
									<Card.Content>
										<Title>Total spent in {x.year}: {this.state.realm.objects('Expense')[0].currency}{parseFloat(this.state.realm.objects('Expense').filtered('year =' + x.year).sum('value')).toFixed(2)}</Title>
									</Card.Content>
									<Card.Actions style={{flexDirection: "row-reverse",}}>
										<Button onPress = {() => {}}>View More</Button>
									</Card.Actions>
								</Card>
								</View>
							))
						}
					</ScrollView>
					</>
				);
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
			<View style = {styles.container}>
				{this.DynamicRender()}
			</View>
		);
	}

}
