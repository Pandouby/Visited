import { Canvas } from '@react-three/fiber/native';
import useControls from 'r3f-native-orbitcontrols';
import React, { Suspense } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Globe } from './src/components/Globe';

export default function App() {
  const [OrbitControls, event] = useControls();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "black"}}>
      <Suspense>
        <View style={{flex: 1}} {...event}>
          <Text>{Platform.OS}</Text>
          <Canvas
            shadows
            frameloop="demand"
            gl={{ preserveDrawingBuffer: true }}
            camera={{
                fov: 50,
                near: 0.1,
                far: 400,
                position: [-15, 1, 1],
            }}
          >
            <OrbitControls enablePan={false} maxZoom={20} minZoom={5} zoomSpeed={1.2} rotateSpeed={1.5}/>
            <Globe />
          </Canvas>
          <Text>{Platform.OS}</Text>
        </View>
      </Suspense>
    </SafeAreaView>
      
  );
}