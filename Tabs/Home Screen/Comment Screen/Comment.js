import { StyleSheet,View,Text,TextInput,Image,TouchableOpacity,ScrollView,StatusBar,SafeAreaView,Platform,Alert } from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { useState,useEffect } from "react";
import { FIRESTORE_DB,FIREBASE_AUTH } from "../../../FirebaseConfig";
import {Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, useFonts } from '@expo-google-fonts/poppins';
import { addDoc,collection, getDocs, setDoc, doc,getDoc, query, updateDoc,where, increment,decrement,deleteDoc} from "firebase/firestore";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons,Feather } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { use } from "react";



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

export default function Comment({route}){
    const [username,set_username]=useState("Username");
    const [currentuname,set_currentuname]=useState("");
    const [ctxt,set_ctxt]=useState("");
    const [comments,set_comments]=useState([]);
    const {postid}=route.params;
    const navi = useNavigation();
    
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
                const post_collections=collection(FIRESTORE_DB,"Comments");
                const snapshots=await getDocs(post_collections);
                const request_data=snapshots.docs.map(doc=>doc.data()).filter(comments=>comments.post_id==postid);
                set_currentuname(user_data.username);
                set_comments(request_data);
            }
          }
          Setup_CurrentUser();

    })
    const save_text= (text)=>{
        if(text.length<60){
            set_ctxt(text);
        }
        else{
          Alert.alert(
                "Hit Character Limit!"
          )
        }
    }

    const submit_btn=async()=>{
        const current_date = new Date();
        const string_date = current_date.getDate()+"-"+current_date.getMonth()+"-"+current_date.getFullYear();
       
        if(ctxt!=""){
            const insert_post = await addDoc(collection(FIRESTORE_DB, 'Comments'), {
              comment_date:string_date,
              comment_txt:ctxt,
              post_id:postid,
              username:currentuname,
            });
            const get_post = doc(FIRESTORE_DB, "Posts", postid);  // <- postId = your document id
            const postsnap = await getDoc(get_post);
            if(postsnap.exists()){    
            await updateDoc(get_post,{
              commentcount:increment(1),
            })
            }
            set_ctxt("");
            Alert.alert(
              "Sucessfully Uploaded the Comment!"
            )
          }


    }

    const load_fonts=useFonts({
        Poppins_700Bold,
        Poppins_800ExtraBold,
        Poppins_500Medium,
        Poppins_600SemiBold
      });

    return(
        <LinearGradient
        colors={['#00BCD4', '#FFFFFF']}
        locations={[0,0.22]}
        start={{x:0,y:0}}
        end={{x:1,y:1}}
        style={{flex:1,
            padding:0,
            margin:0,
        }}> 
        {/*Center Box with CommentBox*/}
        <View style={styles.centerbox}>
            <ScrollView>
                {comments.length>0 ?(
                (comments.flat().map((row)=>(
                <View  style={styles.commentbox}>
                    <View style={styles.ctop}> 
                            <View style={styles.ctopimg}>
                                    <GetProfileImgTag friendname={row.username}/>
                            </View>
                            <View style={styles.ctopdata}>
                                    <Text style={styles.ctopdata_txt}>{row.username}</Text>
                                    <Text style={styles.ctopdata_date}>{row.comment_date}</Text>
                            </View>
                    </View>
                    <View style={styles.cmiddle}>
                            <Text style={styles.cmiddle_txt}>{row.comment_txt}</Text>
                    </View>
                </View>
                   )))):(
                    <Text style={{ textAlign: 'center', fontFamily: 'Poppins_700Bold', fontSize: 16, marginTop: 20 }}>
                    No Comments at the moment!
                  </Text>
                )}

            </ScrollView>
        </View>
           {/*Comment Typing Box*/}
        <View style={styles.typebox}>
            <TextInput style={styles.typeinbox} placeholder="Comment here"  multiline={true} onChangeText={(text)=>save_text(text)}/>
            <TouchableOpacity onPress={()=>{submit_btn()}}>
            <Ionicons style={{right:0,color:'#00BCD4', alignItems:'center',justifyContent:'center',marginLeft:10}} name='send' size={24} />       
            </TouchableOpacity> 
        </View>
        </LinearGradient>
    )
}





const styles=StyleSheet.create({
    centerbox:{
        height:'auto',
        flexDirection:'column',
        flex:10,
        paddingTop:20,
        marginLeft:5, 
    },
    typebox:{
        borderTopColor:"#00BCD4",
        borderTopWidth:2,
        height:'auto',
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        paddingBottom:10,
        paddingTop:10,
    },
    typeinbox:{
        height:50,
        width:'90%',
        borderColor:"#00BCD4",
        borderWidth:1,
        padding:10,
        color:"#00BCD4",
        borderRadius:15,
        fontFamily:'Poppins_500Medium',
    },
    commentbox:{
        borderRadius:20,
        backgroundColor:'white',
        width:366,
        height:'auto',
        flexDirection:'column',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
        marginBottom:10,
    },
    ctop:{
        flexDirection:'row',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        height:'auto',
        width:'100%',
        marginBottom:5,
        padding:10,
    },
    ctopimg:{
        width:28,
        height:28,
        backgroundColor:'black',
        borderRadius:75,
    },
    ctopdata:{
        marginTop:4,
        marginLeft:4,
        flexDirection:'row',
    },
    ctopdata_txt:{
        fontSize:15,
        color:'#00BCD4',
        marginRight:15,
        fontFamily:'Poppins_600SemiBold',
    },
    ctopdata_date:{
        fontSize:15,
        color:'black',
    },
    cmiddle:{
        justifyContent:'flex-start',
        alignItems:'flex-start',
        padding:10,
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        height:'auto',
        width:'100%',
    },
    cmiddle_txt:{
        fontSize:18,
        color:'#00BCD4',
    },

})