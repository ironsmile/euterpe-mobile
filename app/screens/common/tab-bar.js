import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const tabFuncs = {
  CreateTabIcon: (iconName) => {
    return ({ focused, color, size }) => {
      const name = focused ? `${iconName}` : `${iconName}-outline`;
      return <Icon name={name} color={color} size={size} />;
    };
  },

  CreateTabLabel: (label) => {
    return ({ focused, color }) => {
      let fontWeight = 'normal';
      if (focused) {
        fontWeight = 'bold';
      }
      return (
        <Text
          style={[
            styles.label,
            {
              color,
              fontWeight,
            },
          ]}
        >
          {label}
        </Text>
      );
    };
  },
};

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    marginBottom: 3.5,
    fontSize: 10,
  },
});

export default tabFuncs;

export const CreateTabLabel = tabFuncs.CreateTabLabel;
export const CreateTabIcon = tabFuncs.CreateTabIcon;
