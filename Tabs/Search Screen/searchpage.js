import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity,Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FetchAppUsers } from '../FetchData';
import { AuthService,FriendRequestsend } from '../AuthenticationService';
export default function S() {
  const [usernames, setAllUsernames] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [profileData, setProfileData] = useState([]);
  
  const getAllUsernames = async () => {

    const Allappusers=new FetchAppUsers();
    const snapshotappusers=await Allappusers.fetchdata();
    setProfileData(snapshotappusers);
    setAllUsernames(snapshotappusers.map((item) => item.username));
  };

  useEffect(() => {
    getAllUsernames();
  }, []);

  const filteredUsernames = profileData.filter((item) =>
    item.username.toLowerCase().includes(searchInput.toLowerCase())
  );
  
  const sendFriendRequest = async (toUsername) => {
    const formData={
      sendusername:toUsername,
    };
    const friendrequestinstance=new FriendRequestsend();
    const requestadded=new AuthService(friendrequestinstance);
    requestadded.authenticate(formData);
    alert(`Friend request sent to ${toUsername}`);
    await getAllUsernames();
  }
  return (
    <LinearGradient
      colors={['#00BCD4', '#FFFFFF']}
      locations={[0, 0.22]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, padding: 0, margin: 0 }}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Enter Username"
          placeholderTextColor="#666"
          value={searchInput}
          onChangeText={(text) => setSearchInput(text)}
        />
      </View>
      <ScrollView>
        <View style={styles.profileContainer}>
          {filteredUsernames.length > 0 ? (
            filteredUsernames.map((item, index) => (
              <View key={index} style={styles.profileItem}>
                <Image
                  source={{ uri: item.profileUrl }}
                  style={styles.profileImage}
                />
                <Text style={styles.profileText}>{item.username}</Text>
                <TouchableOpacity onPress={() => sendFriendRequest(item.username)}>
                  <LinearGradient
                    colors={['#00BCD4', '#384448']}
                    style={styles.Addfriendbutton}
                  >
                    <Text style={styles.Addfriendtext}>Add Friend</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noUsersText}>No usernames found</Text>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  
  profileContainer:{
    top:  180,
    width: '100%',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  profileItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    height: 60,
    flexDirection: 'row',        
  justifyContent: 'space-between',
  alignItems: 'center', 
  },
  profileText: {
    fontSize: 16,
    color: '#00BCD4',
  },
  noUsersText: {
    fontSize: 16,
    color: '#00BCD4',
    textAlign: 'center',
    marginTop: 20,
  },
  searchContainer: {
    position: 'absolute',
    top:  70,
    width: '100%',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  searchBar: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  Addfriendbutton: {
    width: 100,  
    height:30,   
    borderRadius: 15,
    backgroundColor: "#00BCD4",
    borderColor: "#384448",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection:'row',
    marginRight:10,
},
Addfriendtext: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 12,
    textAlign:"center"
},
profileImage: {
  width: 50,
  height: 50,
  borderRadius: 25, 
},
});
