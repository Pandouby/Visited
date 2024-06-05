import React, { Suspense } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text } from 'react-native';
import { Globe } from './src/components/Globe';
import { Test } from './src/components/Test'

export default function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Text>{Platform.OS}</Text>
      <Suspense >
        <Globe />
      </Suspense>
      <Text>{Platform.OS}</Text>
    </SafeAreaView>
      
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
