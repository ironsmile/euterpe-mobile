/**
 * Created by ggoma on 12/23/16.
 */
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Screen } from './screen';
import { CreateTabIcon, CreateTabLabel } from './common/tab-bar';
import { Settings } from './settings';

export class LibraryScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Library'),
        tabBarIcon: CreateTabIcon('ios-book'),
    });

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.navigation.state.key == "Library";
    }

    render() {
        return (
            <Screen
                title='LIBRARY'
                navigation={this.props.navigation}
            >
                <View style={styles.container}>
                    <Settings />
                </View>
            </Screen>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  text: {
    color: 'white',
    marginTop: 50,
    textAlign: 'center',
  },
});
