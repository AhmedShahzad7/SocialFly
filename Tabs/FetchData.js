import { getAuth } from "firebase/auth";
import { FIRESTORE_DB,FIREBASE_AUTH } from "../FirebaseConfig";
import {
  collection,
  getDocs,getDoc,doc,query,where
} from "firebase/firestore";

class Fetching {
    constructor(instance) {
      this.instance = instance;
    }
    fetchdata = async () => {
      return await this.instance.fetchdata();
    };
  }
  class Fetchusername extends Fetching {
    constructor() {
      super();
    }
    fetchdata = async () => {
      const names = collection(FIRESTORE_DB, "Users");
      const snapshot = await getDocs(names);
      const allusers = snapshot.docs.map((doc) => doc.data().username);
      return allusers;
    };
  }

  class Fetchemails extends Fetching {
    constructor() {
      super();
    }
    fetchdata = async () => {
      const names = collection(FIRESTORE_DB, "Users");
      const snapshot = await getDocs(names);
      const allemails = snapshot.docs.map((doc) => doc.data().email);
      return allemails;
    };
  }

  class FetchAllData extends Fetching {
    constructor() {
      super();
    }
    fetchdata = async () => {
      const user = getAuth().currentUser;
      const userdoc = await getDoc(doc(FIRESTORE_DB, "Users", user.uid));
      const userData = userdoc.data();
      return userData;
    };
  }

  class FetchLikedPosts extends Fetching {
    constructor() {
      super();
    }
    fetchdata = async () => {
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
      return postsData;
    };
  }
  class FetchCurrentUserPosts extends Fetching {
    constructor() {
      super();
    }
    fetchdata = async () => {
      const user = getAuth().currentUser;
      const userdoc = await getDoc(doc(FIRESTORE_DB, "Users", user.uid));
      const user_data = userdoc.data();
      const post_collections=collection(FIRESTORE_DB,"Posts");
      const snapshots=await getDocs(post_collections);
      const post_data=snapshots.docs.map(doc=>doc.data()).filter(post=>post.username==user_data.username);
      return post_data;
    };
  }
  class FetchCurrentUserFriends extends Fetching {
    constructor() {
      super();
    }
    fetchdata = async () => {
      const user = getAuth().currentUser;
      const userdoc = await getDoc(doc(FIRESTORE_DB, "Users", user.uid));
      const user_data = userdoc.data();
      const get_query2=query(collection(FIRESTORE_DB,"Friends"),where("username","==",user_data.username));
      return get_query2
    };
  }

  class FetchCurrentFriendList extends Fetching {
    constructor() {
      super();
    }
    fetchdata = async () => {
      const auth = getAuth();
      const current = auth.currentUser;
      const UserDetails = doc(FIRESTORE_DB, "Users", current.uid);
      const snapusername = await getDoc(UserDetails);
      const currentusername=snapusername.data();
      const q = query(
        collection(FIRESTORE_DB, "Friends"),
        where("username", "==", currentusername.username)
      );
      const snapshot = await getDocs(q);
    
      const friendsData = await Promise.all(
        snapshot.docs.map(async (docItem) => {
          const friendUsername = docItem.data().friendname;
          
          const userQuery = query(
            collection(FIRESTORE_DB, "Users"),
            where("username", "==", friendUsername)
          );
          const userSnapshot = await getDocs(userQuery);
    
          if (!userSnapshot.empty) {
            const friendData = userSnapshot.docs[0].data();
            return {
              friendname: friendUsername,
              profileimage: friendData.profile_url 
            };
          } else {
            return {
              friendname: friendUsername,
              profileimage: '', 
            };
          }
        })
      );
      return friendsData;
    };
  }

  class FetchAppUsers extends Fetching {
    constructor() {
      super();
    }
    fetchdata = async () => {
      const auth = getAuth();
    const currentUser = auth.currentUser;

    
    const userDoc = await getDoc(doc(FIRESTORE_DB, 'Users', currentUser.uid));
    const currentUsername = userDoc.data().username;

    
    const friendsSnapshot = await getDocs(collection(FIRESTORE_DB, 'Friends'));
    const currentUserFriends = friendsSnapshot.docs
      .filter(doc => doc.data().username === currentUsername)
      .map(doc => doc.data().friendname); 

    
    const usersSnapshot = await getDocs(collection(FIRESTORE_DB, 'Users'));
    const filteredUsers = usersSnapshot.docs
      .filter(doc => doc.id !== currentUser.uid) 
      .map(doc => ({
        username: doc.data().username,
        profileUrl: doc.data().profile_url,
      }))
      .filter(user => !currentUserFriends.includes(user.username)); 
      return filteredUsers;
    };
  }

  class FetchUersFriendsChatpage extends Fetching {
    constructor() {
      super();
    }
    fetchdata = async () => {
      const auth = getAuth();
    const current = auth.currentUser;
    const UserDetails = doc(FIRESTORE_DB, "Users", current.uid);
    const snapusername = await getDoc(UserDetails);
    const currentusername=snapusername.data();
    const q = query(
      collection(FIRESTORE_DB, "Friends"),
      where("username", "==", currentusername.username)
    );
    const snapshot = await getDocs(q);
  
    const friendsData = await Promise.all(
      snapshot.docs.map(async (docItem) => {
        const friendUsername = docItem.data().friendname;
        
        const userQuery = query(
          collection(FIRESTORE_DB, "Users"),
          where("username", "==", friendUsername)
        );
        const userSnapshot = await getDocs(userQuery);
  
        if (!userSnapshot.empty) {
          const friendData = userSnapshot.docs[0].data();
          return {
            friendname: friendUsername,
            profileimage: friendData.profile_url 
          };
        } else {
          return {
            friendname: friendUsername,
            profileimage: '', 
          };
        }
      })
    );
    return friendsData;
    };
  }

  export {
    Fetching,
    Fetchemails,
    Fetchusername,
    FetchAllData,
    FetchLikedPosts,
    FetchCurrentUserPosts,
    FetchCurrentUserFriends,
    FetchCurrentFriendList,
    FetchAppUsers,
    FetchUersFriendsChatpage
  }