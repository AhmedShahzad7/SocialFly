import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";

export default function AboutPage() {
  const navi = useNavigation();

  return (
    <LinearGradient
      colors={['#00BCD4', '#FFFFFF']}
      locations={[0, 0.22]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <StatusBar style="dark" translucent backgroundColor="transparent" />

     

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Logo and Title */}
        <View style={styles.logoContainer}>
          <Image source={require('../../Login&SignUp Screens/Logo.png')}style={{ width: 80, height: 80 }} // 👈 Adjust size as needed 
          resizeMode="contain" color="#00BCD4"/>
          <Text style={styles.title}>SocialFly</Text>
        </View>

        {/* About Text */}
        <Text style={styles.description}>
          Welcome to SocialFly! 🌟{"\n\n"}
          SocialFly is where connections soar. Our platform is designed to bring people closer, fostering authentic relationships and vibrant communities.{"\n\n"}
          Whether you're here to share life’s moments, discover new interests, or connect with like-minded individuals, SocialFly offers a seamless, engaging, and secure environment.{"\n\n"}
          Our mission is to inspire meaningful interactions and empower everyone to express themselves freely and authentically.{"\n\n"}
          Join us, and let your social experience take flight! 🚀
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'left',
  },
});
