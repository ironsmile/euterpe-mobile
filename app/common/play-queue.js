import React from 'react';
import { FlatList } from 'react-native';
import { SongSmall } from './song-small';

class QueueItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.index);
    };

    render() {
        return (
            <SongSmall
                {...this.props}
                onSelect={this._onPress}
            />
        )
    }
}

export class PlayQueue extends React.PureComponent {

    _keyExtractor = (item, index) => item.id;

    _onPressItem = (index: number) => {
        this.props.onPressItem(index);
    };

    _renderItem = ({item, index}) => (
        <QueueItem
            id={item.id}
            index={index}
            onPressItem={this._onPressItem}
            song={item}
            highlighted={index === this.props.highlighted}
        />
    );

    render() {
        return (
            <FlatList
                data={this.props.data}
                highlighted={this.props.highlighted}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
            />
        );
    }
}
