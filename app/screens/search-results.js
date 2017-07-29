import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { SELECT_TRACK } from '../reducers/playing';
import Images from '@assets/images';

class SearchReult extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    render() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.dispatch({
                    type: SELECT_TRACK,
                    track: {
                        title: this.props.title,
                        artist: this.props.album,
                        image: Images.unknownAlbum,
                    },
                });
            }}>
                <View style={styles.resultContainer}>
                    <Text style={styles.textTitle}>{this.props.title}</Text>
                    <View style={styles.additional}>
                        <Text style={styles.text}>{this.props.artist}, </Text>
                        <Text style={styles.text}>{this.props.album}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export class SearchReultsRenderer extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Tracks</Text>
                <FlatList
                    keyExtractor={(item, index) => item.id}
                    data={this.props.search.results}
                    renderItem={({ item }) => {
                        return (
                            <SearchReult
                                key={item.id}
                                artist={item.artist}
                                album={item.album}
                                title={item.title}
                                dispatch={this.props.dispatch}
                            />
                        );
                    }}
                />
            </View>);
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
    search: state.search
});

export const SearchReults = connect(mapStateToProps)(SearchReultsRenderer);
