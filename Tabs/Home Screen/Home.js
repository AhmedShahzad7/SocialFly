import { StyleSheet,View,Text,TextInput,Image,TouchableOpacity,ScrollView,StatusBar,SafeAreaView,Platform,Alert } from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { useState,useEffect } from "react";
import { FIRESTORE_DB,FIREBASE_AUTH } from "../../FirebaseConfig";
import {Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, useFonts } from '@expo-google-fonts/poppins';
import { addDoc,collection, getDocs, setDoc, doc,getDoc, query, updateDoc,where, increment,decrement,deleteDoc} from "firebase/firestore";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons,Feather } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';




const GetProfileImgTag=({friendname})=>{
  const [profurl,set_profurl]=useState("-");

  useEffect(()=>{
    const get_url=async()=> {
      if(friendname){
      const get_query=query(collection(FIRESTORE_DB,"Users"), where("username","==",friendname));
      const run_query=await getDocs(get_query);
      const get_userdata=run_query.docs[0].data();
      if(get_userdata.profile_url){
      const profile_url=get_userdata.profile_url
      set_profurl(profile_url);
      }
    }
    };
    get_url();
  },[friendname])

  return (<Image source={{ uri: profurl }} style={{ width: "100%", height: "100%",borderRadius:70}}/>)
}

const GetPostImgTag=({id})=>{
  const [post_url,set_posturl]=useState("-");
  useEffect(()=>{
    const get_url=async()=> {
      if(id){
        const get_post = doc(FIRESTORE_DB, "Posts", id);  // <- postId = your document id
        const postsnap = await getDoc(get_post);
        if(postsnap.exists()){
          post_data=postsnap.data();
          set_posturl(post_data.post_url);
        }

      }
    };
    get_url();
  },[id])

  return (<Image source={{ uri: post_url }} style={{ width: "100%", height: "100%"}}/>)
}

const GetLikeIcon=({id,username})=>{
  const [likebool,set_likebool]=useState(false);

  const Toggle_Like=async(id,username,lbool)=>{
    if (lbool==false){
      if(id){
        set_likebool(true);
        const get_post = doc(FIRESTORE_DB, "Posts", id);  // <- postId = your document id
        const postsnap = await getDoc(get_post);
        if(postsnap.exists()){    
        await updateDoc(get_post,{
          likecount:increment(1),
        })
        let uname=username;
        const insert_post = await addDoc(collection(FIRESTORE_DB, 'Likes'), {
          post_id:id,
          username:uname
        });
     
        }
      }
    }else if(lbool==true){
      set_likebool(false);
      const get_post = doc(FIRESTORE_DB, "Posts", id);  // <- postId = your document id
      const postsnap = await getDoc(get_post);
      if(postsnap.exists()){    
      await updateDoc(get_post,{
        likecount:increment(-1),
      })
      const get_query=query(collection(FIRESTORE_DB,"Likes"), where("username","==",username),where("post_id","==",id));
      const run_query=await getDocs(get_query);
      run_query.forEach(async (row)=>{
        await deleteDoc(doc(FIRESTORE_DB,"Likes",row.id))
      })

      }
    }
  }
  useEffect(()=>{
    const get_url=async()=> {
      if(id && username){
        const get_query=query(collection(FIRESTORE_DB,"Likes"), where("username","==",username),where("post_id","==",id));
        const run_query=await getDocs(get_query);
        const get_userdata=run_query.docs;
        if(get_userdata.length>0){
          set_likebool(true);
        }else{
          set_likebool(false);
        }
      }
    }
    get_url();
  },[id,username])

  return (
    likebool===true ?(
      <TouchableOpacity onPress={()=>Toggle_Like(id,username,true)}>
      <AntDesign name="like1" size={37} color="#00BCD4" />
      </TouchableOpacity>
      
    ):(
      <TouchableOpacity onPress={()=>Toggle_Like(id,username,false)}>
        <AntDesign name="like2" size={37} color="#00BCD4" />
      </TouchableOpacity>
    )
  )
}

export default function H() {
  const [username,set_username]=useState("Username");
  const [currentuname,set_currentuname]=useState("");
  const [requestcount,set_reqcount]=useState(0);
  const [friendslist,setfriendlist]=useState([]);
  const [postlist,setpostlist]=useState([]);

  useEffect(()=>{  
    const Setup_CurrentUser=async()=>
      {
      const current=FIREBASE_AUTH.currentUser;
      if (current==null){
          console.log("No user found!");
          return;
      }else{
          const User_collection = doc(FIRESTORE_DB, "Users", current.uid);
          const snapshot = await getDoc(User_collection);
          const user_data=snapshot.data();
          set_currentuname(user_data.username);
      }
    }
    Setup_CurrentUser();
  });
  useEffect(()=>{
    const Get_Posts=async()=>{
      const get_query2=query(collection(FIRESTORE_DB,"Friends"),where("username","==",currentuname));
      //Running this query
      const run_query2=await getDocs(get_query2);
      setfriendlist(run_query2.docs.map(doc=>({
        id:doc.id,
        ...doc.data() //Auto completing the variables for example the field is username it will auto complete here as username:ahmed_sk and so on
      })));

      if(friendslist.length>0){
        let postarr=[]
        for(let i=0;i<friendslist.length;i++){
          const get_query3=query(collection(FIRESTORE_DB,"Posts"),where("username","==",friendslist[i].friendname));
          //Running this query
          const run_query3=await getDocs(get_query3);
          if(run_query3.docs.length!=0){
          const friend_post=run_query3.docs.map(doc=>({
            id:doc.id,
            ...doc.data() //Auto completing the variables for example the field is username it will auto complete here as username:ahmed_sk and so on
          }))
          postarr.push(friend_post);
        }
        }
        setpostlist(postarr);
        const request_collections=collection(FIRESTORE_DB,"FriendRequests");
        const snapshots=await getDocs(request_collections);
        const request_data=snapshots.docs.map(doc=>doc.data()).filter(friendrequests=>friendrequests.toUsername==currentuname && friendrequests.status=="pending");
        if(request_data.length>0){
          set_reqcount(request_data.length);
        }else{
          set_reqcount(0);
        }
    
        
      }   
    }
    if(currentuname!=""){
    Get_Posts();
    }
  })


  const navi = useNavigation();
  const load_fonts=useFonts({
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_500Medium,
    Poppins_600SemiBold
  });
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

      {/* Top Box with profile image username and notification */}
      <View style={styles.top_box}>
        <View style={styles.top_boxleft}>
          <View style={styles.top_boxpimg}>
                    <GetProfileImgTag friendname={currentuname}/>
          </View>
          <Text style={styles.top_boxtxt}>{currentuname}</Text>
        </View>
   
        <TouchableOpacity style={styles.top_boxbell} onPress={()=>navi.navigate("Notifications")}>
          {requestcount>0 && (
          <View style={styles.top_boxiconlabel}>
              <Text style={styles.top_boxiconltxt} >{requestcount}</Text>
          </View>
          )}
          <Ionicons name="notifications-outline" style={styles.top_boxicon} size={40} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {/* Center Box with Post Box */}
        <View style={styles.center_box}>
        {postlist.length > 0 && postlist  ? (
          postlist.flat().map((row)=>(
            <View style={styles.postbox} key={row.id}>
              <View style={styles.postbox_top}>
                <View style={styles.postbox_topimg}>
                    <GetProfileImgTag friendname={row.username}/>
                </View>
                <View style={styles.postbox_topmini}>
                        <Text style={styles.postbox_topminiuser}>{row.username}</Text>
                        <Text>{row.post_date}</Text>
                </View>
              </View>
              <View style={styles.postbox_center}>
                {row.post_type==="img"?(
                    <View style={styles.postbox_centerimg}>
                      <GetPostImgTag id={row.id}/>
                    </View>
                ):(
                  <View style={styles.postbox_centertxt}>
                      <Text style={styles.postbox_txt}>{row.post_txt}</Text>
                  </View>
                )}
              </View>
              <View style={styles.postbox_bottom}>
                <View style={styles.postbox_bottomlike}>
                  <GetLikeIcon id={row.id} username={currentuname}/>
                    <Text style={styles.postbox_bottmcount}>{row.likecount}</Text>
                  </View>
                  <View  style={styles.postbox_bottomcomm}>
                    <TouchableOpacity onPress={()=>navi.navigate('Comment',{postid:row.id})}>
                    <Ionicons name="chatbox-outline" size={37} color="#00BCD4" />
                    </TouchableOpacity>
                    <Text style={styles.postbox_bottmcount}>{row.commentcount}</Text>
                  </View>
                </View>
          </View>  
        ))):(
            <Text style={{ textAlign: 'center', fontFamily: 'Poppins_700Bold', fontSize: 16, marginTop: 20 }}>
              No Posts at the moment!
            </Text>
        )}
       
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  //Top Box with profile image username and notification style
  top_box:{
    height:'auto',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  top_boxleft:{
    flexDirection:'row',
  },
  top_boxpimg:{
    backgroundColor:'black',
    borderRadius:75,
    width:53,
    height:54,
    marginLeft:18,
    marginTop:42,
    marginBottom:2,
  },
  top_boxtxt:{
    marginTop:56,
    marginLeft:15,
    fontSize:20,
    fontFamily:'Poppins_700Bold',
    color:'#00BCD4',
  },
  top_boxbell:{
    marginTop:56,
    zIndex:1,
    width:60,
    height:'auto',
  },
  top_boxicon:{
    position:'absolute'
  },
  top_boxiconlabel:{
    backgroundColor:'red',
    width:23,
    height:23,
    zIndex:2,
    marginLeft:20,
    borderRadius:75,
  },
  top_boxiconltxt:{
    fontFamily:'Poppins_500Medium',
    color:'white',
    fontSize:15,
    textAlign:'center'
  },
  // Center Box with Post Box Style
  center_box:{
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'column',
    height:'auto',
    marginTop:20,
  },
  postbox:{
    backgroundColor:'white',
    borderRadius:10,
    width:299,
    height:'auto',
    marginTop:20,
    marginBottom:10,
    flexDirection:'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  postbox_top:{
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    flexDirection:'row',
    height:'auto',
    paddingLeft:20,
    paddingTop:10,
    marginBottom:10,
  },
  postbox_topimg:{
    backgroundColor:'black',
    width:38,
    height:38,
    borderRadius:75,
  },
  postbox_topmini:{
    marginLeft:10,
    flexDirection:'column',
  },
  postbox_topminiuser:{
    fontFamily:'Poppins_600SemiBold',
    fontSize:15,
    color:'#00BCD4',
  },
  postbox_topminidate:{
      fontFamily:'Poppins_500Medium',
      fontSize:15,
      color:'black'
  },
  postbox_center:{
    justifyContent:'center',
    alignItems:'center',
    height:'auto',
    marginBottom:10,
  },
  postbox_centerimg:{
    backgroundColor:'black',
    width:259,
    height:353,
  },
  postbox_centertxt:{
    width:259,
    height:'auto',
  },
  postbox_txt:{
    color:'#00BCD4',
    fontSize:19,
    textAlign:'left',
  },
  postbox_bottom:{
    flexDirection:'row',
    height:'auto',
    marginBottom:10,
    justifyContent:'space-evenly',
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
  },
  postbox_bottomlike:{
    flexDirection:'row',

  },
  postbox_bottomcomm:{
    flexDirection:'row',
  },
  postbox_bottmcount:{
    fontSize:17,
    marginTop:11,
    fontFamily:'Poppins_500Medium',
    marginLeft:10,
  },
});
