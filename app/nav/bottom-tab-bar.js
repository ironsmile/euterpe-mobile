import React from 'react';
import { View } from 'react-native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import Footer from '@screens/common/footer';

export function HttpmsBottomTabView(props) {
  return (
    <View>
      <Footer />
      <BottomTabBar {...props} />
    </View>
  );
}
