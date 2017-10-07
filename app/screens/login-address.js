import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Screen } from '@screens/screen';
import Header from '@screens/common/header';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';

export class LoginAddressScreen extends React.Component {

    getHeader() {
        return (
            <Header
                title="SERVER ADDRESS"
                onBackButton={() => {
                    this.props.navigation.goBack();
                }}
            />
        );
    }

    render() {
        return (
            <Screen
                noTabBar={true}
                header={this.getHeader()}
                navigation={this.props.navigation}
            >
                <View style={styles.container}>
                    <Text style={styles.text}>Login Address Screen</Text>
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
