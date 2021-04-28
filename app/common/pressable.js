import React from 'react';
import { Pressable as ReactPressable } from 'react-native';

export function Pressable(props) {
  return <ReactPressable hitSlop={20} {...props} />;
}
