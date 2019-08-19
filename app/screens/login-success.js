import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions, StackActions } from 'react-navigation';

import { Screen } from '@screens/screen';
import { Helpful } from '@components/helpful';

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'LoggedUser' }),
    ],
});

export class LoginSuccessScreenRenderer extends React.Component {

    componentDidMount() {
        setTimeout(() => {
            this.props.navigation.dispatch(resetAction);
        }, 1000);
    }

    render() {
        return (
            <Screen
                noHeader={true}
                noTabBar={true}
                navigation={this.props.navigation}
            >
                <View style={styles.container}>

                    <Helpful
                        title="Login Successful"
                        iconName="checkmark-circle"
                    />

                </View>
            </Screen>
        );
    }

}

const mapStateToProps = (state) => ({
    settings: state.settings,
});

export const LoginSuccessScreen = connect(mapStateToProps)(LoginSuccessScreenRenderer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
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
