import React from 'react';
import { View } from 'react-native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';

export function HttpmsBottomTabView(props) {
    return (
        <View>
            <Footer
                hide={() => {
                  // pass
                }}
                show={() => {
                  // pass
                }}
                hideTabBarNavigation={
                  (val) => {
                    // pass
                  }
                }
            />
            <BottomTabBar {...props} />
        </View>
    )
}