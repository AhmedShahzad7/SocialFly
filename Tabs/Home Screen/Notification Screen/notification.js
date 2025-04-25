import { StyleSheet,View,Text,TextInput,Image,TouchableOpacity,ScrollView,StatusBar,SafeAreaView } from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { useState,useEffect } from "react";
import { FIRESTORE_DB,FIREBASE_AUTH } from "../../../FirebaseConfig";
import {Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { addDoc,collection, getDocs, setDoc, doc,getDoc, query, updateDoc,where } from "firebase/firestore";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import prof from "../../Profile Page Screen/ProfileScreen";



const GetImgTag=({friendname})=>{
  const [profurl,set_profurl]=useState("");

  useEffect(()=>{
    const get_url=async()=> {
      const get_query=query(collection(FIRESTORE_DB,"Users"), where("username","==",friendname));
      const run_query=await getDocs(get_query);
      const get_userdata=run_query.docs[0].data();
      if(get_userdata.profile_url){
      const profile_url=get_userdata.profile_url
      set_profurl(profile_url);
      }
    };
    get_url();
  },[friendname])

  return (<Image source={{ uri: profurl }} style={{ width: "100%", height: "100%",borderRadius:70}}/>)
}


export default function noti() {
  const [username,set_username]=useState("Username");
  const [currentuser,set_currentuser]=useState(null);
  const [requests,set_requests]=useState([]);
  const [currentuname,set_currentuname]=useState("");

  let load_fonts=useFonts({
    Poppins_700Bold
  });
  useEffect(()=>{  
    const Setup_CurrentUser=async()=>
      {
      const current=FIREBASE_AUTH.currentUser;
      if (current==null){
          console.log("No user found!");
          return;
      }else{
          set_currentuser(current);
          const User_collection = doc(FIRESTORE_DB, "Users", current.uid);
          const snapshot = await getDoc(User_collection);
          const user_data=snapshot.data();
          const post_collections=collection(FIRESTORE_DB,"FriendRequests");
          const snapshots=await getDocs(post_collections);
          const request_data=snapshots.docs.map(doc=>doc.data()).filter(friendrequests=>friendrequests.toUsername==user_data.username);
          set_currentuname(user_data.username);
          set_requests(request_data)
      }
    }
    Setup_CurrentUser();
  });
  const accept_request=async(friendname)=>{
    //Getting Request Record here
    const get_query=query(collection(FIRESTORE_DB,"FriendRequests"), where("from","==",friendname));
    //Running this query
    const run_query=await getDocs(get_query);
    //Updating only one
    for(i=0;i<run_query.docs.length;i++){
    await updateDoc(run_query.docs[i].ref,{
      status:'accepted',
    })
  }
    //Check if already friends
    const get_query2=query(collection(FIRESTORE_DB,"Friends"), where("friendname","==",friendname),where("username","==",currentuname));
    //Running this query
    const run_query2=await getDocs(get_query2);
    if (run_query2.docs.length>0){
      console.log("\nAlready friends!");
      return;
    }else{
    const insert_usertofriend = await addDoc(collection(FIRESTORE_DB, 'Friends'), {
      friendname: friendname,
      username:currentuname
    });
    const insert_friendtouser = await addDoc(collection(FIRESTORE_DB, 'Friends'), {
      friendname: currentuname,
      username:friendname,
    });
  }
  }

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
        {/*Top Box With Notification Label */}
      <View style={styles.top_box}>
          <Ionicons name="notifications-outline" size={28} color="#333" style={styles.top_box_icon}/>
          <Text style={styles.top_box_label}>Notifcations</Text>
      </View>
      {/*Center Box with Request Box inside*/}

        <View style={styles.center_box}>
            {/*Recurring Request Box*/}
            <ScrollView>
            {requests.filter(row => row.status !== "accepted").length === 0  ? (
            <Text style={{ textAlign: 'center', fontFamily: 'Poppins_700Bold', fontSize: 16, marginTop: 20 }}>
              No friend requests at the moment!
            </Text>
              ) :
            (requests.map((row)=>(
            <View key={row.id} style={styles.request_box}>
                <View style={styles.request_imgbox}>
                        {/*Reminder to put Image Here*/}
                        <GetImgTag friendname={row.from}/>
                      
                </View>
                <View style={styles.request_minibox}>
                      <Text style={styles.request_text}>{row.from} sent you a friend request! </Text>
                      <TouchableOpacity style={styles.request_button} onPress={()=>accept_request(row.from)} >
                      <Text style={{fontFamily:"Poppins_700Bold",fontSize:14,}}>Accept</Text>
                      </TouchableOpacity>
                      <Text style={styles.request_date}>{row.timestamp.toDate().toLocaleDateString()}</Text>
                </View>
                
            </View> 
              )
            ))}
         
            </ScrollView>
        </View>
 
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  //Top Box With Notification Label Style
  top_box:{
        height:100,
        justifyContent:'flex-start',
        alignItems:'flex-start',
        flexDirection:'row',
  },
  top_box_label:{
    fontFamily:"Poppins_700Bold",
    fontSize:20,
    textDecorationStyle:'solid',
    fontWeight:"750",
    marginTop:60,
    marginLeft:20,
    color:"black",
  },
  top_box_icon:{
    marginTop:60,
    color:"black",
    marginLeft:10,
  },
  //Center Box with Request Box inside Style
  center_box:{
    flex:1,
    height:100,
    marginTop:10,
    flexDirection:'column',
  },
  request_box:{
    borderRadius:20,
    marginRight:10,
    marginLeft:10,
    marginTop:20,
    backgroundColor:'white',
    height:132,
    justifyContent:'flex-start',
    alignItems:'flex-start',
    flexDirection:'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  request_imgbox:{
    marginTop:10,
    marginLeft:5,
    borderRadius: 70,
    width: 85,
    height: 85,
  },
  request_minibox:{
    borderRadius:20,
    height:120,
    width:"75%",

    flexDirection:'column',
    justifyContent:'flex-start',
    alignItems:'flex-start',
  },
  request_text:{
    fontFamily:"Poppins_700Bold",
    fontSize:12,
    fontWeight:"450",
    color:"black",
    marginTop:20,
  },
  request_date:{
    fontFamily:"Poppins_700Bold",
    fontSize:12,
    fontWeight:"450",
    color:"grey",
    marginTop:5,
  },  
  request_button:{
    borderRadius:20,
    marginTop:20,
    width:80,
    height:40,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#00BCD4',
    marginLeft:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  }
});
