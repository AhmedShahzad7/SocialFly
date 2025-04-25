import { StyleSheet,View,Text,TextInput,Image,TouchableOpacity,ScrollView,StatusBar,SafeAreaView } from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { useState,useEffect } from "react";
import { FIRESTORE_DB,FIREBASE_AUTH } from "../../FirebaseConfig";
import {Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { collection, getDocs, setDoc, doc,getDoc } from "firebase/firestore";
import Icon from 'react-native-vector-icons/FontAwesome';






export default function prof(){
    const navi = useNavigation();
    const [post,set_post]=useState([])
    const [friendcount,set_friendcount]=useState(0)
    const [postcount,set_postcount]=useState(0)
    const [username,set_username]=useState("Username")
    const [currentuser,set_currentuser]=useState(null)
    const [profileurl,set_profileurl]=useState("");
    //Initializing Fonts to be used
    let load_fonts=useFonts({
        Poppins_700Bold
      });
    //Get posts/Friends on useState by using UseEffect
    useEffect(()=>{   
        //First Get Collections
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
            set_username(user_data.username);
            const post_collections=collection(FIRESTORE_DB,"Posts");
            const snapshots=await getDocs(post_collections);
            const post_data=snapshots.docs.map(doc=>doc.data()).filter(post=>post.username==user_data.username);
            set_postcount(post_data.length);
            set_profileurl(user_data.profile_url);
            set_post(post_data);
        }
    };

        Setup_CurrentUser()
    })
 

    return(
        //Outer Linear Gradient Background
        
        <LinearGradient
        colors={['#00BCD4', '#FFFFFF']}
        locations={[0,0.22]}
        start={{x:0,y:0}}
        end={{x:1,y:1}}
        style={{flex:1,
            padding:0,
            margin:0,
        }}>
        <StatusBar   style="dark" translucent={true} backgroundColor="black" />
        {/*Create Post Button Section*/}
        <View style={profile_style.createpostrow}>
            <TouchableOpacity onPress={()=>navi.navigate("Create Post")}>
                <LinearGradient colors={["#00BCD4", "#384448"]} style={profile_style.createpostbutton}>
                <Icon name="plus" style={profile_style.createposticon}/>
                    <Text style={profile_style.createposttext}>Create Post</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
        {/*User Info Section*/}
        <View style={profile_style.userinfo}>
            {/*PF Image holder*/}
            <View style={profile_style.pfimg}>
             {/*Reminder to put <Image> here*/}
             <Image source={{ uri: profileurl}} style={{ width: "100%", height: "100%",borderRadius:75, }}/>
             </View>
            <View style={profile_style.pftext}>
                    <Text style={profile_style.pftextuser}>{username}</Text>

                    <View style={profile_style.pftextdetail}>
                        <View style={profile_style.pftexnumtext}>
                            <Text style={profile_style.pftextcounter}>{postcount}</Text>
                            <Text style={profile_style.pftextlabel}>Posts</Text>

                        </View>
                        <View style={profile_style.pftexnumtext}>
                            <Text style={profile_style.pftextcounter}>{friendcount}</Text>
                            <Text style={profile_style.pftextlabel}>Friends</Text>
                        </View>
                    </View>
                  
            </View>
        </View>
        {/*Your Posts Section*/}
        <View style={profile_style.yourpost}>
                <Text style={profile_style.yourposttext}>Your Posts</Text>
                <Icon name="arrow-down" style={profile_style.yourposticon} />
        </View>
        {/*Posts Section*/}
        <ScrollView>
        <View style={profile_style.postsection}>
            <View style={profile_style.postsectionmini}>
                    {post.map((row,index)=>(
                     <View key={index}   style={profile_style.postdata}>
                            {row.post_type==="txt"?(
                                 <Text style={profile_style.post_text}>{row.post_txt}</Text>

                            ):(
                                <Image source={{ uri: row.post_url }} style={{ width: "100%", height: "100%" }}/>
                            )}
                        </View>
                    ))}
            </View>
            
        </View>
    
        </ScrollView>
        {/*Space Left For Navbar*/}
        {/* <View style={profile_style.navbar}>


        </View> */}
        </LinearGradient>

    )

}





const profile_style=StyleSheet.create({
    //Create Post Style Section
    createpostrow:{
        height:100,
        justifyContent:'flex-end',
        alignItems:'flex-end',
        flexDirection:'row'
    },
    createpostbutton: {
        width: 140,     
        padding: 10,
        borderRadius: 15,
        backgroundColor: "#00BCD4",
        borderColor: "#384448",
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        flexDirection:'row',
        marginRight:10,
   },
    createposttext: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign:"center"
    },
    createposticon:{
        fontSize:16,
        color:'white',
        marginRight:10,
    },
    //User Info Style Section
    userinfo:{
        justifyContent:'flex-start',
        alignContent:'flex-start',
        height:100,
        marginTop:40,
        flexDirection:'row',
    },  
    pfimg:{
        borderRadius:70,
        width:99,
        height:97,
        backgroundColor:'black',
        marginLeft:17,
    },
    pftext:{
        flexDirection:'column',
        
    },
    pftextuser:{
        fontFamily:"Poppins_700Bold",
        marginLeft:30,
        fontSize:20,
        textDecorationStyle:'solid',
        //Edit this if you want to make UserName text darker or bolder
        fontWeight:"750",
        marginTop:10,
        marginBottom:5,
   
    },
    pftextdetail:{
        flexDirection:'row'
    },  
    pftexnumtext:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        marginLeft:20,
        marginRight:2,
    },
    pftextlabel:{
        fontFamily:"Poppins_700Bold",
        textDecorationStyle:'solid',
        fontWeight:"650",
        fontSize:18,
        alignItems:'center',
        justifyContent:'left',
        color:'#00BCD4',
        marginRight:2,
    },
    pftextcounter:{
        fontFamily:"Poppins_700Bold",
        textDecorationStyle:'solid',
        fontWeight:"600",
        fontSize:18,
        alignItems:'center',
        justifyContent:'center'
    },
    
    //Your Posts Style Section
     yourpost:{
        justifyContent:'flex-start',
        alignItems:'flex-end',
        flexDirection:'row',
        borderBottomWidth:3,
        borderBottomColor: '#00BCD4',
        height:100,
     },
     yourposttext:{
        fontFamily:"Poppins_700Bold",
        textDecorationStyle:'solid',
        fontWeight:"700",
        fontSize:20,
        color:'#00BCD4',
        marginLeft:10,
     },
     yourposticon:{
        fontFamily:"Poppins_700Bold",
        textDecorationStyle:'solid',
        fontSize:20,
        color:'#00BCD4',
        marginLeft:10,
     },
     
     //Post Style Section
     postsection :{
        flex:1,
        marginBottom:60,
        flexDirection:'column',
        justifyContent:'flex-start',
        alignItems:'flex-start'
     },
     postsectionmini:{
        flexWrap: 'wrap',
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'flex-start',

     },
     postdata:{
        borderWidth:1,
        borderColor:'#00BCD4',
        backgroundColor:'white',
        width:126,
        height:222,
       marginLeft:1,
       marginBottom:1,
       marginTop:1,
     },
     post_text:{
        width:"100%",
        height:"100%",
        fontFamily:"Poppins_700Bold",
        fontSize:20,
        justifyContent:'left',
        alignItems:'left',
     },
     //Navbar Section 
     navbar:{
        height:75,
     }

})