import React from 'react';
import { Text, View, StatusBar } from 'react-native';
import { gs, hs } from '../../styles/global';
import { RecentlyPlayed } from './recently-played';


export class HomeScreen extends React.Component {

  static navigationOptions = {
    title: 'HOME',
    headerStyle: gs.bg,
    headerTitleStyle: hs.font,
  };

  render() {
    return (
      <View style={[gs.bg, gs.container]}>
        <StatusBar
          barStyle="light-content"
        />
        <RecentlyPlayed />
      </View>
    );
  }
}
