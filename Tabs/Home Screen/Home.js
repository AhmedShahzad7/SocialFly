import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
export default function H() {
  const navi = useNavigation();
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
      <TouchableOpacity style={styles.bellContainer} onPress={()=>navi.navigate("Notifications")}>
        <Ionicons name="notifications-outline" size={28} color="#333" />
      </TouchableOpacity>
    <View style={styles.container}>
      <Text style={styles.text}>Home Page!</Text>
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
  bellContainer: {
    position: 'absolute',
    top: 40, 
    right: 20,
    zIndex: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
