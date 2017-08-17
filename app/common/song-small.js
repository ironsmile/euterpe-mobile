import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';


export class SongSmall extends React.PureComponent {
    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.props.highlighted) {
                        return;
                    }
                    this.props.onSelect();
                }}
                style={[
                    styles.container,
                    this.props.style,
                    this.props.highlighted ? styles.highlightedContainer : null,
                    this.props.noLeftRightPadding ? styles.noLeftRightPadding : null,
                ]}
            >
                <Text
                    style={[
                        styles.textTitle,
                        this.props.highlighted ? styles.highlighted : null,
                    ]}
                    numberOfLines={1}
                >
                    {this.props.song.title}
                </Text>
                <View style={styles.additional}>
                    <Text
                        style={[
                            styles.text,
                            this.props.highlighted ? styles.highlighted : null,
                        ]}
                        numberOfLines={1}
                    >
                        {this.props.song.artist},
                    </Text>
                    <Text> </Text>
                    <Text
                        style={[
                            styles.text,
                            this.props.highlighted ? styles.highlighted : null,
                        ]}
                        numberOfLines={1}
                    >
                        {this.props.song.album}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    text: {
        fontSize: 12,
        color: '#aeafb3',
    },
    textTitle: {
        color: 'white',
    },
    additional: {
        flex: 1,
        flexDirection: 'row',
    },
    highlighted: {
        fontWeight: 'bold',
    },
    highlightedContainer: {
        backgroundColor: '#222327',
    },
    noLeftRightPadding: {
        paddingLeft: 0,
        paddingRight: 0,
    },
});
