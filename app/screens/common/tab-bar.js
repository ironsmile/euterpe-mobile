import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const tabFuncs = {
    CreateTabIcon: (iconName) => {
        return ({tintColor, focused}) => {
            let name = iconName;
            if (!focused) {
                name = iconName + '-outline';
            }
            return (
                <Icon name={name} color={tintColor} size={24} />
            );
        }
    },

    CreateTabLabel: (label) => {
        return ({tintColor, focused}) => {
            let fontWeight = 'normal';
            if (focused) {
                fontWeight = 'bold';
            }
            return (
                <Text style={{
                    textAlign: 'center',
                    marginBottom: 3.5,
                    fontSize: 10,
                    color: tintColor,
                    fontWeight
                }}>{label}</Text>
            );
        }
    },
}



export default tabFuncs;

export const CreateTabLabel = tabFuncs.CreateTabLabel;
export const CreateTabIcon = tabFuncs.CreateTabIcon;
