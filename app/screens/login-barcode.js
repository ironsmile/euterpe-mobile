import React from 'react';
import { Text, StyleSheet, View, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Camera from 'react-native-camera';

import { Screen } from '@screens/screen';
import Header from '@screens/common/header';
import { CreateTabIcon, CreateTabLabel } from '@screens/common/tab-bar';
import { Helpful } from '@components/helpful';
import { PlatformIcon } from '@components/platform-icon';
import { changeSettings, registerToken, checkSuccess, checkError } from '@actions/settings';
import { errorToMessage } from '@helpers/errors';

export class LoginBarcodeScreenRenderer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            waitForAuthInfo: true,
            authorized: false,
            camera: Camera.constants.Type.back,
            evaluatingBarCode: false,
            errorMessage: null,
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

        let qrMessage = null;

        if (this.state.evaluatingBarCode) {
            qrMessage = (
                <View style={styles.verticallyAligned}>
                    <PlatformIcon
                        color="green"
                        platform="qr-scanner"
                        size={18}
                    />
                    <Text style={styles.barcodeFound}>QR Code Found. Checking...</Text>
                </View>
            );
        }

        let errorMessage = null;

        if (this.state.errorMessage !== null) {
            errorMessage = (
                <View style={styles.verticallyAligned}>
                    <Text style={styles.errorMessage}>
                        {this.state.errorMessage}
                    </Text>
                </View>
            );
        }

        return (
            <Camera
                ref={(cam) => {
                    this.camera = cam;
                }}
                type={this.state.camera}
                style={styles.preview}
                aspect={Camera.constants.Aspect.fill}
                barCodeTypes={['qr']}
                onBarCodeRead={(event) => {
                    if (this.state.evaluatingBarCode) {
                        return;
                    }

                    this.setState({
                        errorMessage: null,
                        evaluatingBarCode: true,
                    });

                    let parsedData = null;

                    try {
                        parsedData = JSON.parse(event.data);

                        if (typeof parsedData !== Object ||
                            (parsedData.software != "httpms" &&
                                parsedData.software != "euterpe")) {
                            throw parsedData;
                        }
                    } catch (error) {
                        this.setState({
                            errorMessage: 'Not a valid HTTPMS QR code',
                        });
                    } finally {
                        if (this.state.errorMessage !== null) {
                            if (this._tm) {
                                clearTimeout(this._tm);
                            }

                            this._tm = setTimeout(() => {
                                this.setState({
                                    errorMessage: null,
                                    evaluatingBarCode: false,
                                });
                            }, 10000);
                        }
                    }

                    if (parsedData === null) {
                        return;
                    }

                    this.props.dispatch(changeSettings({
                        hostAddress: parsedData.address,
                        token: parsedData.token,
                    }));

                    this.props.dispatch(registerToken(
                        (responseJson) => {
                            if (this._tm) {
                                clearTimeout(this._tm);
                            }
                            this.props.navigation.navigate('LoginSuccess');

                            this.setState({
                                evaluatingBarCode: false,
                            });
                        },
                        (error) => {
                            this.setState({
                                errorMessage: errorToMessage(
                                    error,
                                    'This QR code does not work.'),
                            });

                            if (this._tm) {
                                clearTimeout(this._tm);
                            }

                            this._tm = setTimeout(() => {
                                this.setState({
                                    evaluatingBarCode: false,
                                });
                            }, 10000);
                        }
                    ));
                }}
            >
                {errorMessage}
                {qrMessage}

                <View style={[styles.verticallyAligned, styles.hintBackground]}>
                    <Text style={styles.hintText}>
                        Point to a HTTPMS QR Code
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            let newCamera = Camera.constants.Type.back;

                            if (this.state.camera === Camera.constants.Type.back) {
                                newCamera = Camera.constants.Type.front;
                            }

                            this.setState({
                                camera: newCamera,
                            });
                        }}
                    >
                        <PlatformIcon
                            color="white"
                            platform="reverse-camera"
                            size={34}
                        />
                    </TouchableOpacity>
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

const mapStateToProps = (state) => ({
    settings: state.settings,
});

export const LoginBarcodeScreen = connect(mapStateToProps)(LoginBarcodeScreenRenderer);

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
        marginTop: 10,
    },
    verticallyAligned: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    hintText: {
        backgroundColor: 'transparent',
        color: 'white',
        marginRight: 10,
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    barcodeFound: {
        marginLeft: 10,
        color: 'green',
        fontWeight: 'bold',
        fontSize: 18,
    },
    errorMessage: {
        color: 'white',
        backgroundColor: 'rgba(1,1,1,0.7)',
        borderRadius: 6,
        padding: 10,
    }
});
