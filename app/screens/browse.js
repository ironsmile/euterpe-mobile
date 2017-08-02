/**
 * Created by ggoma on 12/23/16.
 */
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Screen } from './screen';
import { CreateTabIcon, CreateTabLabel } from './common/tab-bar';

export class BrowseScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('Browse'),
        tabBarIcon: CreateTabIcon('ios-albums'),
    });

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.navigation.state.key == "Browse";
    }

    render() {
        return (
            <Screen
                title='BROWSE'
                navigation={this.props.navigation}
            >
                <View style={styles.container}>
                    <Text style={styles.text}>
                        There is nothing to browse.
                    </Text>
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
