import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView,Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FetchCurrentFriendList } from '../../FetchData';
export default function friendlist() {
    const [listfriends,setfriendlist]=useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [allFriends, setAllFriends] = useState([]);

    const fetchfriendlist = async () => {
        const currentfriendlist=new FetchCurrentFriendList();
        const userfriends=await currentfriendlist.fetchdata();
        setfriendlist(userfriends);
        setAllFriends(userfriends);
      };
      
      useEffect(() => {
        fetchfriendlist();
      }, []);

      useEffect(() => {
        if (searchInput.trim() === '') {
          setfriendlist(allFriends);
        } 
        else {
          const filtered = allFriends.filter(friend =>
            friend.friendname.toLowerCase().includes(searchInput.toLowerCase())
          );
          setfriendlist(filtered);
        }
      }, [searchInput, allFriends]);

      
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
          {listfriends.length > 0 ? (
            listfriends.map((item, index) => (
              <View key={index} style={styles.profileItem}>
                <Image
                  source={{ uri: item.profileimage }}
                  style={styles.profileImage}
                />
                <Text style={styles.profileText}>{item.friendname}</Text>
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
  justifyContent: 'flex-start',
  alignItems: 'center', 
  gap:40,
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
profileImage: {
  width: 50,
  height: 50,
  borderRadius: 25, 
},
});
