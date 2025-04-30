import React, { useState,useEffect } from 'react';
import { View, StyleSheet,ScrollView,Text,Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDoc,doc,query,where,collection,getDocs } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';
import { getAuth } from 'firebase/auth';
export default function liked_posts() {
    const [posts, setPosts] = useState([]);
    const getposts=async()=>{
        const current = getAuth().currentUser;
        const currentUser_collection = doc(FIRESTORE_DB, "Users", current.uid);
        const usersnapshot = await getDoc(currentUser_collection);
        const currentuser_data_username=usersnapshot.data().username;
        const postquery = query(
            collection(FIRESTORE_DB, "Likes"),
            where("username", "==", currentuser_data_username)
          );
        const querySnapshot = await getDocs(postquery);
        const postIds = querySnapshot.docs.map(doc => doc.data().post_id); // assuming each Like document has postId
        const postsData = [];
        for (let postId of postIds) {
          const postRef = doc(FIRESTORE_DB, 'Posts', postId);
          const postSnap = await getDoc(postRef);
          if (postSnap.exists()) {
            const post = postSnap.data();
            postsData.push({ id: postId, ...post });
          }
        }
        setPosts(postsData);
    }
    useEffect(() => {
      getposts();
    }, []);
  return (
    <LinearGradient
      colors={['#00BCD4', '#FFFFFF']}
      locations={[0, 0.22]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, padding: 0, margin: 0 }}
    >
     
      <ScrollView>
      <View style={styles.profileGrid}>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <View key={index} style={styles.gridItem}>
              {post.post_type === 'img' ? (
                <Image
                  source={{ uri: post.post_url }}
                  style={styles.postImage}
                />
              ) : (
                <Text style={styles.profileText}>{post.post_txt}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noUsersText}>No liked posts found</Text>
        )}
      </View>
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 180,
  },
  
  gridItem: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  
  postImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
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
  
  

});

