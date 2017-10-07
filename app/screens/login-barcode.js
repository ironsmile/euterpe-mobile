import React from 'react';
import { Text, StyleSheet, View, Platform } from 'react-native';

import Camera from 'react-native-camera';

import { Screen } from '@screens/screen';
import Header from '@screens/common/header';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';
import { Helpful } from '@components/helpful';

export class LoginBarcodeScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            waitForAuthInfo: true,
            authorized: false,
        };
    }

    getHeader() {
        return (
            <Header
                title="BARCODE SCANNER"
                onBackButton={() => {
                    this.props.navigation.goBack();
                }}
            />
        );
    }

    componentWillMount() {
        if (Platform.OS === 'ios') {
            Camera.checkVideoAuthorizationStatus().then((authorized) => {
                this.setState({
                    waitForAuthInfo: false,
                    authorized,
                });
            });
        } else {
            this.setState({
                waitForAuthInfo: false,
                authorized: true,
            });
        }
    }

    getBody() {
        if (this.state.waitForAuthInfo) {
            return (
                <Text style={styles.text}>Checking camera permissions...</Text>
            );
        }

        if (!this.state.authorized) {
            return (
                <Helpful
                    title="No Camera Permissions"
                    firstLine=""
                    iconName="camera"
                >
                    <Text style={styles.text}>
                        The app has no camera permissions. They are required in order to use the
                        device's camera for scanning HTTPMS details barcode. Please go to Settings -> httpms
                        and allow the camera.
                    </Text>
                </Helpful>
            );
        }

        return (
            <Camera
                ref={(cam) => {
                    this.camera = cam;
                }}
                style={styles.preview}
                aspect={Camera.constants.Aspect.fill}
                barCodeTypes={['qr']}
                onBarCodeRead={(event) => {
                    console.log(event);
                }}
            >
                <View style={styles.hintBackground}>
                    <Text style={styles.hintText}>
                        Point to a HTTPMS QR Code
                    </Text>
                </View>
            </Camera>
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
                    {this.getBody()}
                </View>
            </Screen>
        );
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
        color: '#aeafb3',
        textAlign: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    hintBackground: {
        borderRadius: 6,
        backgroundColor: 'rgba(1,1,1,0.7)',
        padding: 10,
        marginBottom: 10,
    },
    hintText: {
        backgroundColor: 'transparent',
        color: 'white',
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
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
});
