import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function createpost() {
  
  return (
    <LinearGradient
        colors={['#00BCD4', '#FFFFFF']}
        locations={[0,0.22]}
        start={{x:0,y:0}}
        end={{x:1,y:1}}
        style={{flex:1,
            padding:0,
            margin:0,
        }}>
    <View style={styles.container}>
      <Text style={styles.text}>Create Post Page!</Text>
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
    fontWeight: 'bold',
    color: '#333',
  },
});
