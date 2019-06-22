import React from 'react';
import { connect } from 'react-redux';
import { Text, StyleSheet, View } from 'react-native';
import { Screen } from '@screens/screen';
import { IconButton } from '@components/icon-button';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';
import { playMediaViaService } from '@actions/playing';

export class AboutScreenRenderer extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: CreateTabLabel('About'),
        tabBarIcon: CreateTabIcon('ios-information-circle'),
    });

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.navigation.state.key == "About";
    }

    render() {
        return (
            <Screen
                title='ABOUT'
                navigation={this.props.navigation}
            >
                <View style={styles.container}>
                    <Text style={[styles.text, styles.header]}>
                        HTTPMS Mobile Player
                    </Text>

                    <Text style={styles.text}>
                        Version: 0.1 Beta
                    </Text>

                    <Text style={[styles.text, styles.header]}>
                        OpenSource projects used in this app:
                    </Text>

                    <Text style={styles.text}>
                        ReactNative
                    </Text>

                    <Text style={styles.text}>
                        ggomaeng's UI experiment
                    </Text>

                    <Text style={[styles.text, styles.thankyou]}>
                        Thank you all for your hard work which made this
                        app possible!
                    </Text>

                    <View style={{marginTop: 15, paddingLeft: 30, paddingRight: 30}}>
                        <IconButton
                            text="Play Via Service"
                            iconName="play"
                            onPress={() => {
                                this.props.dispatch(playMediaViaService());
                            }}
                        />
                    </View>

                </View>
            </Screen>
        )
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

const mapStateToProps = (state) => ({
});

export const AboutScreen = connect(mapStateToProps)(AboutScreenRenderer);
