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

const AppStack = createStackNavigator(
  {
	Home: {
		screen: home,
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
	AddExpense:{
		screen: add,
		title: '',
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
		title: '',
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