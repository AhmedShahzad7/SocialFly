import { StyleSheet,View,Text,TextInput,TouchableOpacity,Platform,Alert } from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import { useState,useEffect } from "react";
import { FIRESTORE_DB,FIREBASE_AUTH } from "../../../FirebaseConfig";
import {Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, useFonts } from '@expo-google-fonts/poppins';
import { addDoc,collection, setDoc, doc,getDoc } from "firebase/firestore";
import {Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function createpost() {
    const [choice,set_choice]=useState('txt');
    const [imgname,set_imgname]=useState('Image Name');
    const [imgstore,set_imstore]=useState(null);
    const [currentuname,set_currentuname]=useState("");
    const [urlimg,set_urlimg]=useState('');
    const [posttext,set_posttext]=useState("");
   //Initializing Fonts to be used
   useEffect(()=>{  
      const Setup_CurrentUser=async()=>{
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
  },[]);


   const load_fonts=useFonts({
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_500Medium,
    Poppins_600SemiBold
  });
  const choice_switch=(option)=>{
    if (option=="txt"){
      set_choice("txt");
    }else if(option =="img"){
      set_choice("img");
    }
  }
    //IMGUR API
    const upload_imgur=async (image)=>{
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Client-ID e5819bf42a81316");
      var formdata = new FormData();
      formdata.append("image",image);
      formdata.append("type", "base64");
      formdata.append("title", "Simple upload");
      formdata.append("description", "This is a simple image upload in Imgur");
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
      try { 
        const response = await fetch("https://api.imgur.com/3/image", requestOptions);
        const text  = await response.text();
        const result = JSON.parse(text);
            const link = result.data.link;
            set_urlimg(link);
            return link;
      }
      catch (error) {
        console.log('imgurl api error: ', error);
      }
    
  }

    const choosePhotoFromLibrary = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });
  
      if (!result.canceled) {
          set_imstore(result.assets[0].base64);
          set_imgname(result.assets[0].uri.split('/').pop());
      }
    };
  
    const takePhotoFromCamera = async () => {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  
      if (!permissionResult.granted) {
        alert("Permission to access camera is required!");
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });
      if (!result.canceled) {
         set_imstore(result.assets[0].base64);
         set_imgname(result.assets[0].uri.split('/').pop());
     }
    };
  
    const handleImagePress = () => {
      if (Platform.OS === "web") {
        window.alert("Post Picture\nChoose from Gallery\nTake Photo\nCancel");
      } else {
        Alert.alert(
          "Post Picture",
          "Choose an option",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Choose from Gallery", onPress: choosePhotoFromLibrary },
            { text: "Take Photo", onPress: takePhotoFromCamera },
          ],
          { cancelable: true }
        );
      }
    };
  
    const handlesave = async () => {
      if (!updatefullname) {
        alert('Fill all the fields');
        return;
      }
  
      await setDoc(doc(FIRESTORE_DB, "Users", user.uid), {
        fullName: updatefullname,
      }, { merge: true });
  
      alert("Profile Updated Successfully!");
    };
    const submit_post= async ()=>{
      const current_date = new Date();
      const string_date = current_date.getDate()+"-"+current_date.getMonth()+"-"+current_date.getFullYear();
      if(choice=="img"){
        const link=await upload_imgur(imgstore);
        if(link){
          console.log(link);
          const insert_post = await addDoc(collection(FIRESTORE_DB, 'Posts'), {
            post_txt: "-",
            post_type:"img",
            post_url:link,
            username:currentuname,
            post_date:string_date,
            likecount:0,
            commentcount:0,
          });
          Alert.alert(
            "Sucessfully Uploaded the post!"
          )
        }
      }else if(choice=="txt"){
        if(posttext!=""){
          const insert_post = await addDoc(collection(FIRESTORE_DB, 'Posts'), {
            post_txt:posttext,
            post_type:"txt",
            post_url:"-",
            username:currentuname,
            post_date:string_date,
            likecount:0,
            commentcount:0,
          });
          Alert.alert(
            "Sucessfully Uploaded the post!"
          )
        }
      }
    };
    const save_text= (text)=>{
      if(text.length<60){
      set_posttext(text);
      }
      else{
        Alert.alert(
              "Hit Post Limit!"
        )
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
        {/*Top Box with Create Post Label and Icon*/}
        <View style={styles.top_box}>
             <Feather name="pen-tool" size={38} color="#333" style={styles.top_box_icon}/>
              <Text style={styles.top_box_label}>Create Post</Text>
        </View>
        {/*Center Box with Create Post Box*/}
        <View style={styles.center_box}>
            {/*Center Box Top Box*/}
            <View style={styles.center_box_topbox}>
              <Text style={styles.center_box_topbox_label}>Post Type</Text>
            </View>
            {/*Center Box Top Radio Box*/}
            <View style={styles.center_box_topradio}>
                {/*Radio Text*/}
                <Text style={styles.center_box_topradio_label}>Text</Text>
                <TouchableOpacity onPress={()=>choice_switch("txt")}>
                   <View style={styles.radio_btn}>
                      {choice=="txt" && <View style={styles.radion_btnchecked}/>}
                    </View>     
                </TouchableOpacity>
                  {/*Radio Image*/}
                  <Text style={styles.center_box_topradio_label}>Image</Text>
                <TouchableOpacity onPress={()=>choice_switch("img")}>
                   <View style={styles.radio_btn}>
                      {choice=="img" && <View style={styles.radion_btnchecked}/>}
                    </View>     
                </TouchableOpacity>
            </View>
            {/*Center Box Center mini Box*/}
            {choice=="txt" &&(
                 <View style={styles.center_box_centermini_txt}>
                    <TextInput style={styles.center_box_centertxt}   placeholderTextColor="#00BCD4" placeholder="Enter text here" multiline={true} onChangeText={(text)=>save_text(text)}/>
                 </View>
            )}
            {choice=="img" &&(
              <View style={styles.center_box_centermini_img}>
                         <Text style={styles.center_box_centerimglabel}  numberOfLines={1}     adjustsFontSizeToFit>{imgname}</Text>
                            <TouchableOpacity onPress={()=>handleImagePress()}>
                                <LinearGradient colors={["#00BCD4", "#384448"]}  style={styles.createpostbutton}>
                                      <Text style={styles.createposttext} >Upload</Text>
                                </LinearGradient>
                            </TouchableOpacity>


              </View>
            )}
            <TouchableOpacity onPress={()=>submit_post()}>
                <LinearGradient colors={["#00BCD4", "#384448"]}  style={styles.submit_btn}>
                      <Text style={styles.submit_txt}>Submit</Text>
                </LinearGradient>
            </TouchableOpacity>
   
        </View>


    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  //Top Box with Create Post Label and Icon Styles
  top_box:{
    height:105,
    justifyContent:'flex-start',
    alignItems:'flex-start',
    flexDirection:'row',
  },
  top_box_label:{
    fontFamily:"Poppins_800ExtraBold",
    fontSize:28,
    textDecorationStyle:'solid',
    fontWeight:700,
    marginTop:60,
    marginLeft:20,
    color:"black",
  },
  top_box_icon:{
    marginTop:65,
    color:"black",
    marginLeft:10,
  },
  //Center Box with Create Box Styles
  center_box:{
   backgroundColor:'white',
   width:366,
   height:"auto",
   justifyContent:'flex-start',
   alignItems:'flex-start',
   marginLeft:8,
   marginTop:36,
   borderRadius:35,
   flexDirection:'column',
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 4 },
   shadowOpacity: 0.25,
   shadowRadius: 10,
   elevation: 10,
   paddingBottom:50,
  },
  center_box_topbox:{
    borderTopLeftRadius:35,
    borderTopRightRadius:35,
    width:'100%',
    justifyContent:'flex-start',
    alignItems:'flex-start',
    height:70,
  },
  center_box_topbox_label:{
    fontFamily:"Poppins_800ExtraBold",
    fontSize:20,
    textDecorationStyle:'solid',
    fontWeight:650,
    marginTop:30,
    marginLeft:20,
    color:"black",
  },
  center_box_topradio:{
    width:'100%',
    justifyContent:'flex-start',
    alignItems:'flex-start',
    height:70,
    flexDirection:'row',
  },
  center_box_topradio_label:{
    fontFamily:"Poppins_500Medium",
    fontSize:20,
    marginTop:30,
    marginLeft:20,
    marginRight:3,
    color:"black",
  },
  radio_btn:{
    borderRadius:75,
    borderColor:'black',
    borderWidth:3,
    width:24,
    height:24,
    marginTop:35,
    marginLeft:20,
    justifyContent:'center',
    alignItems:'center'
  },
  radion_btnchecked:{
    width: 12,
    height: 12,
    borderRadius: 5,
    backgroundColor: 'black',
  },
  center_box_centermini_txt:{
    borderRadius:35,
    width:335,
    justifyContent:'flex-start',
    alignItems:'flex-start',
    height:289,
    paddingTop:20,
    paddingLeft:23,
    marginLeft:15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    backgroundColor:'white',
    
  },
  center_box_centertxt:{
    fontFamily:"Poppins_600SemiBold",
    fontSize:20,
    textDecorationStyle:'solid',
    color:"#00BCD4",
    width:330,
    height:250,
    textAlignVertical: 'top', 
    alignSelf: 'stretch',
    marginRight:4,
  

  },
  center_box_centermini_img:{
    width:'75%',
    justifyContent:'center',
    alignItems:'center',
    height:70,
    paddingLeft:80,
    flexDirection:'row',
  },
  center_box_centerimglabel:{
    fontFamily:"Poppins_600SemiBold",
    fontSize:20,
    textDecorationStyle:'solid',
    color:"#00BCD4",
  },
  createpostbutton: {
    width: 135,     
    padding:15,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight:10,
    marginLeft:10,
    backgroundColor: "#00BCD4",
    borderColor: "#384448",
},
createposttext: {
  color: "#ffffff",
  fontWeight: "bold",
  fontSize: 16,
  textAlign:"center"
},
submit_btn:{
  width: 135,     
  padding:15,
  borderRadius: 35,
  justifyContent: "center",
  alignItems: "center",
  marginLeft:120,
  marginTop:40,
  backgroundColor: "#00BCD4",
  borderColor: "#384448",
},
submit_txt:{
  color: "#ffffff",
  fontWeight: "bold",
  fontSize: 16,
  textAlign:"center"
}

});
