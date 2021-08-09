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
		RefreshControl,
		ToastAndroid,
		AlertIOS,
		Platform,
	} from 'react-native';
import {Button, Card, Title} from 'react-native-paper';

const Realm = require('realm');
import {ExpenseSchema} from '../utils/schemas';
import styles from '../utils/style';

export default class expenses_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            render: false,
			reload: 0,
			realm: null,
			refresh: false,
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
				return(<>
					<ScrollView locked={true} style={styles.list} stickyHeaderIndices={[0]}
						refreshControl = { <RefreshControl refreshing={this.state.refresh} onRefresh={this.loadDatas}/>}
					>
						{
							this.state.realm.objects('Expense').filtered('TRUEPREDICATE SORT(year DESC) DISTINCT(year)').map((x, i) => (
								<View key={i} style = {{paddingBottom:10}}>
								<Card>
									<Card.Content>
										<Title>Total spent in {x.year}: {this.state.realm.objects('Expense')[0].currency}{parseFloat(this.state.realm.objects('Expense').filtered('year =' + x.year).sum('value')).toFixed(2)}</Title>
									</Card.Content>
									<Card.Actions style={{flexDirection: "row-reverse",}}>
										<Button onPress = {() => {
											try{
												this.props.navigation.navigate('Year_details',{year: x.year});
											}catch(error){
												if (Platform.OS === 'android') {
													ToastAndroid.show('The Expense not exist, try to reload', ToastAndroid.SHORT);
												} else {
													AlertIOS.alert('The Expense not exist, try to reload');
												}
											}
										}}>View More</Button>
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
