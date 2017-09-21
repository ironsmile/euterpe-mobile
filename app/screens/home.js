import React from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { Screen } from '@screens/screen';
import { RecentArtists } from '@components/recent-artists';
import { RecentAlbums } from '@components/recent-albums';

export class HomeScreen extends React.Component {
    render() {
        return (
            <Screen
                title="HOME"
                navigation={this.props.navigation}
            >
                <View style={styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <RecentArtists
                            key={0}
                            onArtistPress={(item) => {
                                this.props.navigation.navigate(
                                    'SearchArtist',
                                    { artist: item.artist }
                                );
                            }}
                        />
                        <RecentAlbums
                            key={1}
                            onAlbumPress={(item) => {
                                this.props.navigation.navigate(
                                    'SearchAlbum',
                                    { album: item }
                                );
                            }}
                        />
                    </ScrollView>
                </View>
            </Screen>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
