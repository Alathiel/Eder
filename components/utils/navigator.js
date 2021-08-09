/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
//navigator
import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import NavigationService from './NavigationService';
//screens
import home from '../screens/home';
import add from '../screens/add';
import edit from '../screens/edit';
import expenses_list from '../screens/expenses_list';
import details from '../screens/details';

const AppStack = createStackNavigator(
	{
		Home: {
			screen: home,
			navigationOptions:{
				title: 'Eder',
				headerStyle: {
					position: 'absolute',
					backgroundColor: 'transparent',
					elevation: 0,
					shadowOpacity: 0,
					borderBottomWidth: 0,
				},
			},
		},
		AddExpense:{
			screen: add,
			navigationOptions:{
				title: '',
				headerStyle: {
					position: 'absolute',
					backgroundColor: 'transparent',
					elevation: 0,
					shadowOpacity: 0,
					borderBottomWidth: 0,
				},
			},
		},
		EditExpense:{
			screen: edit,
			navigationOptions:{
				title: '',
				headerStyle: {
					position: 'absolute',
					backgroundColor: 'transparent',
					elevation: 0,
					shadowOpacity: 0,
					borderBottomWidth: 0,
				},
			},
		},
		Expenses_list:{
			screen: expenses_list,
			navigationOptions:{
				title: '',
				headerStyle: {
					position: 'absolute',
					backgroundColor: 'transparent',
					elevation: 0,
					shadowOpacity: 0,
					borderBottomWidth: 0,
				},
			},
		},

		Year_details:{
			screen: details,
			navigationOptions:{
				title: '',
				headerStyle: {
					position: 'absolute',
					backgroundColor: 'transparent',
					elevation: 0,
					shadowOpacity: 0,
					borderBottomWidth: 0,
				},
			},
		},
	},

	{
		initialRouteName: 'Home',
	}
);

const AppContainer = createAppContainer(AppStack);

export default class Navigator extends React.Component {
  render() {
    return <AppContainer ref={navigatorRef => {NavigationService.setTopLevelNavigator(navigatorRef);}}/>;
  }
}