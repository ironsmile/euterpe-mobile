import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { connect } from 'react-redux';
import moment from 'moment';

class TrackProgressRenderer extends React.Component {
    componentWillMount() {
        this.renderProps = {
            unfilledColor: '#3c3d41',
            borderWidth: 0,
            borderRadius: 0,
            height: 2,
            width: null,
            color: 'white',
            ...this.props,
        };
    }

    render() {
        return (
            <ProgressBar
                {...this.renderProps}
                progress={this.props.progress}
                indeterminate={this.props.loading === true}
                animated={this.props.loading === true}
            />
        );
    }
}

class TimedProgressRenderer extends React.Component {
    componentWillMount() {
        this.renderProps = {
            unfilledColor: '#3c3d41',
            borderWidth: 0,
            borderRadius: 0,
            height: 2,
            width: null,
            color: 'white',
        };
    }

    componentWillReceiveProps(nextProps) {
        this.textWidth = getTimesWidth(nextProps.duration);
    }

    render() {
        return (
            <View style={[styles.timedProgressContainer, this.props.style]}>
                <Text style={[styles.text, { width: this.textWidth - 5 }]}>
                    {elapsedTime(this.props.progress, this.props.duration)}
                </Text>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <ProgressBar
                        {...this.renderProps}
                        progress={this.props.progress}
                        indeterminate={this.props.loading === true}
                        animated={this.props.loading === true}
                    />
                </View>
                <Text style={[styles.text, { width: this.textWidth, textAlign: 'right' }]}>
                    {remamingTime(this.props.progress, this.props.duration)}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    timedProgressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 12,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 12,
    }
});

const getTimesWidth = (duration) => {
    if (duration >= 3600) {
        return 55;
    }

    if (duration >= 600) {
        return 45;
    }

    return 38;
};

const elapsedTime = (progress, duration) => {
    if (!duration) {
        return '--:--';
    }

    return formatDuration(progress * duration, duration);
};

const remamingTime = (progress, duration) => {
    if (!duration) {
        return '--:--';
    }

    return `-${formatDuration(duration - (progress * duration), duration)}`;
};

const formatDuration = (duration, wholeDuration) => {
    const format = (wholeDuration >= 3600) ? 'h:mm:ss' : 'm:ss';

    return moment(duration * 1000).format(format);
};

const mapStateToProps = (state) => ({
    progress: state.progress.value,
    duration: state.progress.duration,
});

export const TrackProgress = connect(mapStateToProps)(TrackProgressRenderer);
export const TimedProgress = connect(mapStateToProps)(TimedProgressRenderer);
