import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
export default function sett () {
  const navi = useNavigation();
  const menuitems = [
    { icon: 'person-outline', label: 'Profile detail' },
    { icon: 'heart-outline', label: 'Liked Posts' },
    { icon: 'time-outline', label: 'Screen time' },
    { icon: 'help-circle-outline', label: 'About' },
    { icon: 'log-out-outline', label: 'Logout' },
  ];

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
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headertitle}>
          <Ionicons name="settings-outline" size={26} color="black" />
          <Text style={styles.headertext}>Settings</Text>
        </View>
      </View>

      {/* Menu */}
      <ScrollView contentcontainerstyle={styles.menucontainer}>
        {menuitems.map((item, index) => (
          <TouchableOpacity
          key={index}
          style={styles.menuitem}
          onPress={() => {
            if (item.label === 'Profile detail') {
              navi.navigate('Profile Detail'); 
            }
            if (item.label === 'About') {
              navi.navigate('About'); 
            }
            if (item.label === 'Liked Posts') {
              navi.navigate('Liked Posts'); 
            }
            if (item.label === 'Screen time') {
              navi.navigate('Screen Time'); 
            }
            //  add more conditions here for other Pages
          }}
        >
          <Ionicons name={item.icon} size={20} color="#000" style={styles.menuicon} />
          <Text style={styles.menutext}>{item.label}</Text>
        </TouchableOpacity>
        
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headertitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 20, 
    marginBottom:50,
  },
  headertext: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  menucontainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    marginTop: 20,
  },
  menuitem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fbff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e1e8f0',
    elevation: 1,
  },
  menuicon: {
    marginRight: 15,
  },
  menutext: {
    fontSize: 16,
    color:'#00BCD4'
  },
});

