import { React, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList,Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { FetchUersFriendsChatpage } from '../FetchData';
export default function C() {
  const chatnavi = useNavigation();
  const [Friend,setfriend]=useState([]);
  const friendclicked = (currentfriend,currentfriendprofileimage) => {
    chatnavi.navigate("Message", { currentfriend,currentfriendprofileimage });
  };
  const AllFriends = async () => {
    const fetchchatpagedetails=new FetchUersFriendsChatpage();
    const userchatpage=await fetchchatpagedetails.fetchdata();
    setfriend(userchatpage);
  };
  
  useEffect(() => {
    AllFriends();
  }, []);

  return (
    <LinearGradient
      colors={['#00BCD4', '#FFFFFF']}
      locations={[0, 0.22]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {Friend.length === 0 ? (
          <Text style={{ color: 'black', textAlign: 'center', marginTop: 20 }}>No friends found</Text>
        ) : (
          <FlatList
            data={Friend}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => friendclicked(item.friendname,item.profileimage)}>
              <LinearGradient colors={["#00BCD4", "#384448"]} style={styles.ProfileContainer}>
                <Image
                  source={{ uri: item.profileimage }}
                  style={styles.profileima}
                />
                <Text style={styles.ProfileText}>{item.friendname}</Text>
              </LinearGradient>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.ProfilesContainer}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, 
  },
  ProfilesContainer: {
    marginTop: 60,
    paddingBottom: 100,
  },
  ProfileContainer: {
    width: "100%",
    height: 70,
    flexDirection: "row",       
    alignItems: "center",       
    paddingHorizontal: 20,
    borderColor: "white",
    borderWidth: 1,
  },
  
  ProfileText: {
    color: "black",
    fontSize: 18,
    padding: 17.5,
    paddingLeft: 50,
  },
  profileima: {
    width: 50,
    height: 50,
    borderRadius: 25, 
  },
});
