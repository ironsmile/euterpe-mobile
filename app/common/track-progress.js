import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { connect } from 'react-redux';
import moment from 'moment';

class TrackProgressRenderer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      renderProps: {
        unfilledColor: '#3c3d41',
        borderWidth: 0,
        borderRadius: 0,
        height: 2,
        width: null,
        color: 'white',
      },
    };
  }

  render() {
    return (
      <ProgressBar
        {...this.state.renderProps}
        {...this.props}
        progress={this.props.progress}
        indeterminate={this.props.loading === true}
        animated={this.props.loading === true}
      />
    );
  }
}

class TimedProgressRenderer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      renderProps: {
        unfilledColor: '#3c3d41',
        borderWidth: 0,
        borderRadius: 0,
        height: 2,
        width: null,
        color: 'white',
      },
      textWidth: getTimesWidth(props.duration),
    };
  }

  render() {
    const { textWidth } = this.state;
    const { duration, progress, loading, style } = this.props;

    return (
      <View style={[styles.timedProgressContainer, style]}>
        <Text style={[styles.text, { width: textWidth - 5 }]}>
          {elapsedTime(progress, duration)}
        </Text>
        <View style={styles.timedProgressBarElement}>
          <ProgressBar
            {...this.state.renderProps}
            progress={progress}
            indeterminate={loading === true}
            animated={loading === true}
          />
        </View>
        <Text
          style={[
            styles.text,
            styles.alignRight,
            {
              width: textWidth,
            },
          ]}
        >
          {remaingTime(progress, duration)}
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
    lineHeight: 12,
  },
  timedProgressBarElement: {
    flex: 1,
    justifyContent: 'center',
  },
  alignRight: {
    textAlign: 'right',
  },
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

const remaingTime = (progress, duration) => {
  if (!duration) {
    return '--:--';
  }

  return `-${formatDuration(duration - progress * duration, duration)}`;
};

const formatDuration = (duration, wholeDuration) => {
  const format = wholeDuration >= 3600 ? 'h:mm:ss' : 'm:ss';
  let renderDuration = duration;

  if (renderDuration < 0) {
    renderDuration = 0;
  }

  return moment(renderDuration * 1000).format(format);
};

const mapStateToProps = (state) => ({
  progress: state.progress.value,
  duration: state.progress.duration,
});

export const TrackProgress = connect(mapStateToProps)(TrackProgressRenderer);
export const TimedProgress = connect(mapStateToProps)(TimedProgressRenderer);
