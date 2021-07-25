/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
import React,{Component} from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import {Icon} from 'react-native-elements';

export class floating_button extends Component {
	render() {
		return (
			<View style={style.fixedButton}>
				<TouchableWithoutFeedback onPress={() => this.setState({visible:true})}>
					<Icon name='pluscircle' type='antdesign'/>
				</TouchableWithoutFeedback>
			</View>
		);
	}
}


const style={

	fixedButton: {
	position:'absolute',
	bottom: 30,
	right: 30,
	width: 46,
	height: 46,
	backgroundColor: "#42a5f5",
	borderRadius: 46,
	borderColor:'#2597f4',
	borderWidth:0.1,
	alignContent: "center",
	justifyContent: "center",
  },
}