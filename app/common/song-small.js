import React from 'react';

import { SmallClickable } from '@components/small-clickable';
import { formatDuration } from '@helpers/duration';

export class SongSmall extends React.PureComponent {
  getAdditionalText() {
    const { withAlbum, song } = this.props;

    if (withAlbum === false) {
      return song.artist;
    }

    return `${song.artist}, ${song.album}`;
  }

  formatDuration() {
    const { song } = this.props;
    if (!song || !song.duration) {
      return '--:--';
    }

    return formatDuration(song.duration / 1000);
  }

  render() {
    const { highlighted, song, onSelect } = this.props;
    return (
      <SmallClickable
        highlighted={highlighted}
        mainText={song.title}
        additionalText={this.getAdditionalText()}
        rightText={this.formatDuration()}
        onSelect={() => {
          if (highlighted) {
            return;
          }
          onSelect();
        }}
      />
    );
  }
}
