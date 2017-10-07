import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { PlatformIcon } from '@components/platform-icon';

export class IconButton extends React.PureComponent {
    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.props.onPress) {
                        this.props.onPress();
                    }
                }}
            >
                <View style={styles.buttonContainer}>
                    <PlatformIcon platform={this.props.iconName}
                        color="white" size={16} />
                    <Text style={styles.buttonText}>{this.props.text}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#222327',
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 20,
        borderWidth: 2,
        borderColor: '#3c3d41',
        flexDirection: 'row',
    },
    buttonText: {
        paddingLeft: 10,
        fontWeight: 'bold',
        color: 'white',
    },
});
