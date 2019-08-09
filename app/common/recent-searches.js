import React from 'react';
import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { connect } from 'react-redux';

import { gs } from '@styles/global';
import { FOOTER_HEIGHT } from '@screens/common/footer';
import { PlatformIcon } from '@components/platform-icon';
import { Helpful } from '@components/helpful';

class ClearSearches extends React.PureComponent {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <Text style={styles.clearSearchesText}>
                    Clear recent searches
                </Text>
            </TouchableOpacity>
        );
    }
}

class RecentSearch extends React.PureComponent {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={styles.recentSearchContainer}>
                    <Text numberOfLines={1} style={gs.font}>
                        {this.props.text}
                    </Text>
                    <PlatformIcon
                        style={styles.rotatedIcon}
                        platform="arrow-round-up"
                        color="#aeafb3"
                        size={24}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

class RecentSearchesRenderer extends React.PureComponent {
    renderListWithSearches() {
        return (
            <ScrollView
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
            >
                {this.props.recentSearches.map((text, index) => (
                    <RecentSearch
                        key={index}
                        text={text}
                        onPress={() => {
                            this.props.searchClicked(text);
                        }}
                    />
                ))}
                <ClearSearches
                    key={-1}
                    onPress={() => {
                        this.props.onClearSearchesPress();
                    }}
                />
                <View key={-2} style={{ height: FOOTER_HEIGHT }} />
            </ScrollView>
        );
    }

    renderHelpfulScreen() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Helpful
                    title="Search Your Music"
                    firstLine="Listen to your own songs, artists,"
                    secondLine="albums. Wherever you go they would follow."
                    icon={(<PlatformIcon
                        ios="ios-search"
                        md="md-search"
                        color="#aeafb3"
                        size={128}
                    />)}
                />
            </TouchableWithoutFeedback>
        );
    }

    render() {
        if (this.props.recentSearches.length < 1) {
            return this.renderHelpfulScreen();
        }

        return this.renderListWithSearches();
    }
}

const styles = StyleSheet.create({
    recentSearchContainer: {
        width: '100%',
        paddingLeft: 16,
        paddingRight: 16,
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 32,
        alignItems: 'center',
    },
    clearSearchesText: {
        color: '#aeafb3',
        marginTop: 24,
        paddingLeft: 16,
    },
    rotatedIcon: {
        transform: [{ rotate: '-45deg' }],
    },
});

const mapStateToProps = (state) => ({
    recentSearches: state.search.recentSearches,
});

export const RecentSearches = connect(mapStateToProps)(RecentSearchesRenderer);
