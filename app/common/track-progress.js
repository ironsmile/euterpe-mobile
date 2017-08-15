import React from 'react';
import { StyleSheet } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { connect } from 'react-redux';

class TrackProgressRenderer extends React.Component {
    componentWillMount() {
        this.renderProps = {
            unfilledColor: '#3c3d41',
            borderWidth: 0,
            borderRadius: 0,
            height: 2,
            width: null,
            color: 'white',
            animated: false,
            ...this.props,
            style: [
                styles.progress,
                this.props.style,
            ],
        };
    }

    render() {
        return (
            <ProgressBar
                {...this.renderProps}
                progress={this.props.progress}
                indeterminate={this.props.loading === true}
            />
        );
    }
}

const styles = StyleSheet.create({
    progress: {

    }
});

const mapStateToProps = (state) => ({
    progress: state.progress,
});

export default TrackProgress = connect(mapStateToProps)(TrackProgressRenderer);
