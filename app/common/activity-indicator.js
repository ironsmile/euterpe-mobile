import React from 'react';
import { ActivityIndicator as NativeActivitiIndicator } from 'react-native';
import { gs } from '@styles/global';

export function ActivityIndicator(props) {
  return <NativeActivitiIndicator color={gs.font.color} {...props} />;
}
