/* eslint-disable react/self-closing-comp */
/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, ScrollView, ActivityIndicator, TouchableWithoutFeedback} from 'react-native';
import NavigationService from '../utils/NavigationService';
import styles from '../utils/style';
import {ListItem, Icon} from 'react-native-elements';
import SQLite from 'react-native-sqlite-2';

const db = SQLite.openDatabase('records.db', '1.0', '', 1);
var datas = [];

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            render: false,
			reload:0,
        };
		this.loadDatas();
    }

	forceRemount = () => {
        this.setState(({ reload }) => ({
          reload: reload + 1,
        }));
    }

	getDatas(){
		return new Promise(resolve => {
			setTimeout(() => {
				db.transaction(function (txn) {
					txn.executeSql('SELECT * FROM `records`', [], function (tx, res) {
						var len = res.rows.length;
						var rows = [];
						for (let i = 0; i < len; i++) {
							let row = res.rows.item(i);
							rows [i] = row;
						}
						resolve(rows);
					});
				});
			}, 2000);
		});
	}

	async loadDatas(){
		datas = await this.getDatas()
		.catch((err) => { console.error(err); });
		this.setState({render:true});
		console.log(datas);
	}

	DynamicRender(){
		if(this.state.render){
			return(<>
				<ScrollView key={this.state.reload} locked={true} style={styles.list}>
					{
						datas.map((l, i) => (
							<ListItem
								key={i}
								//leftAvatar={{ source: { uri: l.avatar_url } }}
								title={l.title}
								subtitle={l.value}
								bottomDivider
								/*rightIcon={
									<TouchableWithoutFeedback data-id={i} onPress={() => this.setState({ isVisible: true, index: l.index})}>
										<Icon name="menu" type="material-icons"/>
									</TouchableWithoutFeedback>
								}*/
								onPress={() => this.props.navigation.navigate('Site',{url: l.url})}
								onLongPress={() => this.setState({ isVisible: true, index: l.index})}/>
						))
					}
				</ScrollView>
				<View style = {styles.footer}>
						<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate()}>
							<Icon name='PlusCircleOutlined' type='antdesign'/>
						</TouchableWithoutFeedback>
				</View>
				</>
			);
		}

		else{
			return (
				<View style={{justifyContent:'center', alignContent:'center',minHeight:'100%'}}>
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
