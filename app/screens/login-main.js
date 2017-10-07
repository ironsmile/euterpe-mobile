import React from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import { Screen } from '@screens/screen';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';
import { IconButton } from '@components/icon-button';

export class LoginMainScreen extends React.Component {

    render() {
        return (
            <Screen
                noTabBar={true}
                noHeader={true}
                navigation={this.props.navigation}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.containerContent}
                >
                    <Text style={styles.text}>Add a HTTPMS server</Text>

                    <View style={styles.buttonWrapper}>
                        <IconButton
                            text="Scan a Barcode"
                            iconName="qr-scanner"
                            onPress={() => {
                                this.props.navigation.navigate('LoginBarcode');
                            }}
                        />
                        <Text style={styles.subduedText}>
                            Use your devices camera to scan a barcode, generated in the
                            web inteface of your HTTPMS installation.
                        </Text>
                    </View>

                    <View style={styles.buttonWrapper}>
                        <IconButton
                            text="Manual Entry"
                            iconName="create"
                            onPress={() => {
                                this.props.navigation.navigate('LoginAddress');
                            }}
                        />
                        <Text style={styles.subduedText}>
                            Manually enter the HTTPS server address, your username and
                            password if any required.
                        </Text>
                    </View>
                </ScrollView>
            </Screen>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    containerContent: {
        justifyContent: 'center',
        alignItems: 'stretch',
        marginTop: 150,
    },
    text: {
        color: 'white',
        textAlign: 'center',
    },
    buttonWrapper: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    subduedText: {
        marginTop: 5,
        color: '#aeafb3',
        textAlign: 'center',
    },
});
