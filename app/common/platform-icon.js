import React from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export class PlatformIcon extends React.PureComponent {
    render() {
        const props = this.props;
        let name;

        if (Platform.OS === 'android') {
            name = props.platform ? `md-${props.platform}` : props.md;
        } else {
            name = props.platform ? `ios-${props.platform}` : props.ios;
        }

        return (
            <Icon
                {...this.props}
                name={name}
            />
        );
    }
}
