import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const tabFuncs = {
  CreateTabIcon: (iconName) => {
    return ({ focused, color, size }) => {
      return <Icon name={iconName} color={color} size={size} />;
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
          style={{
            textAlign: 'center',
            marginBottom: 3.5,
            fontSize: 10,
            color,
            fontWeight,
          }}
        >
          {label}
        </Text>
      );
    };
  },
};

export default tabFuncs;

export const CreateTabLabel = tabFuncs.CreateTabLabel;
export const CreateTabIcon = tabFuncs.CreateTabIcon;
