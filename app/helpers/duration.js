import moment from 'moment';

export const formatDuration = (duration, wholeDuration) => {
  const format = wholeDuration >= 3600 ? 'h:mm:ss' : 'm:ss';
  let renderDuration = duration;

  if (renderDuration < 0) {
    renderDuration = 0;
  }

  return moment(renderDuration * 1000).format(format);
};
