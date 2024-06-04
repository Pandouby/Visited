import { Suspense } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, Image } from 'react-native';
import { Globe } from './src/components/Globe';
import { Test } from './src/components/Test';
import React from 'react';

export default function App() {
  return (
    <SafeAreaView>
            <Text>{Platform.OS}</Text>
            <Suspense fallback={<Text>... loading</Text>}>
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
