import React from 'react';
import Index from './index';
import "./shim";
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import {ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';

AppRegistry.registerComponent(appName, () => App);

export default function App() {
  let [fontsLoaded] = useFonts({
    'Outfit': require('./assets/fonts/Outfit-VariableFont_wght.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return <Index />;
}

