import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Screen } from '@screens/screen';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';

export class LoginSuccessScreen extends React.Component {

    render() {
        return (
            <Screen
                noTabBar={true}
                header={null}
                navigation={this.props.navigation}
            >
                <View style={styles.container}>
                    <Text style={styles.text}>Login Success Screen</Text>
                </View>
            </Screen>
        );
    }

}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 15,
  },
  thankyou: {
    fontStyle: 'italic',
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 15,
  }
});
