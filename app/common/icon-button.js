import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { PlatformIcon } from '@components/platform-icon';

export class IconButton extends React.PureComponent {
    render() {

        let buttonText = this.props.text;

        if (this.props.disabled && this.props.disabledText) {
            buttonText = this.props.disabledText;
        }

        const iconProps = {
            color: 'white',
            size: 16,
        };

        const containerStyle = {};
        const textStyle = {};

        if (this.props.disabled) {
            iconProps.color = '#aeafb3';
            textStyle.color = '#aeafb3';
            containerStyle.backgroundColor = '#3c3d41';
        }

        const btn = (
            <View style={[styles.buttonContainer, containerStyle]}>
                <PlatformIcon platform={this.props.iconName}
                    {...iconProps} />
                <Text style={[styles.buttonText, textStyle]}>{buttonText}</Text>
            </View>
        );

        if (this.props.disabled) {
            return btn;
        }

        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.props.onPress) {
                        this.props.onPress();
                    }
                }}
            >
                {btn}
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
