import React from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export class PlatformIcon extends React.PureComponent {
    componentWillMount() {
        this.refreshName(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.refreshName(nextProps);
    }

    refreshName(props) {
        if (Platform.OS === 'android') {
            this.name = props.platform ? `md-${props.platform}` : props.md;
        } else {
            this.name = props.platform ? `ios-${props.platform}` : props.ios;
        }
    }

    render() {
        return (
            <Icon
                {...this.props}
                name={this.name}
            />
        );
    }
}
