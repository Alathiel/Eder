/* eslint-disable prettier/prettier */
'use strict';

var React = require('react-native');

var {StyleSheet} = React;

module.exports = StyleSheet.create({
	container:{
		paddingTop: 10,
		minHeight: '100%',
		minWidth: '100%',
		maxHeight:'100%',
		maxWidth:'100%',
		justifyContent: 'space-between',
		alignItems: 'center',
		flex: 1,
	},

	list:{
		minWidth: '95%',
		maxWidth: '95%',
		minHeight: '99%',
		maxHeight: '99%',
	},

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

	list_icon:{
		paddingTop:15,
		paddingRight:5,
	},
});