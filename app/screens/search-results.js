import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { setPlaylist, setTrack } from '../actions/playing';

class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onSelect() {

    }

    render() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.onSelect();
            }}>
                <View style={styles.resultContainer}>
                    <Text style={styles.textTitle}>{this.props.song.title}</Text>
                    <View style={styles.additional}>
                        <Text style={styles.text}>{this.props.song.artist}, </Text>
                        <Text style={styles.text}>{this.props.song.album}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export class SearchResultsRenderer extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Tracks</Text>
                <FlatList
                    keyExtractor={(item, index) => item.id}
                    data={this.props.search.results}
                    renderItem={({ item }) => {
                        return (
                            <SearchResult
                                key={item.id}
                                song={item}
                                onSelect={() => {
                                    this.props.dispatch(setPlaylist([item]));
                                    this.props.dispatch(setTrack(0));
                                }}
                            />
                        );
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    resultContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 10,
        width: '100%',
    },
    text: {
        color: 'white',
        fontSize: 12,
    },
    textTitle: {
        color: 'white',
    },
    header: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    additional: {
        flex: 1,
        flexDirection: 'row',
    }
});

const mapStateToProps = (state) => ({
    search: state.search,
});

export const SearchResults = connect(mapStateToProps)(SearchResultsRenderer);
