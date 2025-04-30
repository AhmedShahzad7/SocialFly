import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar'; // optional
import { LinearGradient } from 'expo-linear-gradient';
export default function App() {
  const [counter, setCounter] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const savedCounter = parseInt(localStorage.getItem('screenTime') || '0', 10);
    setCounter(savedCounter);
    const interval = setInterval(() => {
      setCounter(prevCounter => {
        const newCounter = prevCounter + 1;
        localStorage.setItem('screenTime', newCounter.toString());
        return newCounter;
      });
    }, 1000);

    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        localStorage.setItem('screenTime', counter.toString());
      }
      setAppState(nextAppState);
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      clearInterval(interval);
      appStateSubscription.remove();
    };
  }, [counter]); 

  return (
    <LinearGradient
      colors={['#00BCD4', '#FFFFFF']}
      locations={[0, 0.22]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, padding: 0, margin: 0 }}
    >
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.text}>Screen time: {counter} seconds</Text>
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: '#00BCD4',
  },
});
