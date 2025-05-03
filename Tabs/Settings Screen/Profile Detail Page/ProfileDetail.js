import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from "firebase/auth";
import {  doc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../FirebaseConfig";
import { FetchAllData } from "../../FetchData";
import { AuthService,updateUserinfo } from "../../AuthenticationService";


export default function ProfileDetailScreen() {
  const [updatefullname, setupdatefullname] = useState('');
  const [updateemail, setupdateemail] = useState('');
  const [updateusername, setupdateusername] = useState('');
  const [updatepassword, setupdatepassword] = useState('');
  const [urlimg,set_urlimg]=useState('');



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


  const user = getAuth().currentUser;

  const profilefetch=async()=>{
    const fetch=new FetchAllData();
    const v=await fetch.fetchdata();
    setupdatefullname(v.fullName);
    setupdateemail(v.email);
    setupdateusername(v.username);
    setupdatepassword(v.password);
    set_urlimg(v.profile_url);
  }

  useEffect(() => {
    profilefetch();
  },[]);

 

  const choosePhotoFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
        const link = await upload_imgur(result.assets[0].base64);
        if(link){
        await updateDoc(doc(FIRESTORE_DB, 'Users', user.uid), {
          profile_url: link
        });
        console.log('Profile updated with image URL:',link);
        }
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
    const success = await upload_imgur(result.assets[0].base64);
    if(success){
      await updateDoc(doc(FIRESTORE_DB, 'Users', user.uid), {
        profile_url: urlimg
      });
      console.log('Profile updated with image URL:', link);
      }
  };

  const handleImagePress = () => {
    if (Platform.OS === "web") {
      window.alert("Profile Picture\nChoose from Gallery\nTake Photo\nCancel");
    } else {
      Alert.alert(
        "Profile Picture",
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

  const formData={
    fullName:updatefullname,
  };

  const handlesave = async () => {
    if (!updatefullname) {
      alert('Fill all the fields');
      return;
    }
    const ProfileInstance=new updateUserinfo();
    const Updationprofile=new AuthService(ProfileInstance);
    Updationprofile.authenticate(formData);
    alert("Profile Updated Successfully!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.HeadingContainer}>
        <Text style={styles.Heading}>Profile</Text>
      </View>

      <View style={styles.pfimgWrapper}>
        <TouchableOpacity style={styles.pfimg} onPress={handleImagePress}>
             <Image source={{ uri:urlimg }} style={{ width: "100%", height: "100%",borderRadius:70 }}/>           
            <Text style={{ color: 'white', textAlign: 'center', marginTop: 35,position:'absolute' }}>Edit</Text>
            
        </TouchableOpacity>
      </View>

      <View style={styles.bodyContainer}>
        <TextInput style={styles.bodyText} value={updatefullname} onChangeText={setupdatefullname} placeholder="Full Name" />
      </View>
      <View style={styles.bodyContainer}>
        <TextInput style={styles.bodyText} value={updateemail} editable={false} placeholder="Email Address" />
      </View>
      <View style={styles.bodyContainer}>
        <TextInput style={styles.bodyText} value={updateusername} editable={false} placeholder="Username" />
      </View>
      <View style={styles.bodyContainer}>
        <TextInput style={styles.bodyText} value={updatepassword} editable={false} placeholder="Password"  />
      </View>

      <View style={styles.buttoncontainer}>
        <LinearGradient colors={["#00BCD4", "#384448"]} style={styles.savebutton}>
          <TouchableOpacity style={styles.savebutton} onPress={handlesave}>
            <Text style={styles.savetext}>Save</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingTop: '50' },
  text: { fontSize: 20, fontWeight: "bold" },
  HeadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  Heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  bodyContainer: {
    marginHorizontal: 10,
    marginTop: 60,
  },
  bodyText: {
    color: 'black',
    fontSize: 15,
    borderBottomColor: '#384448',
    borderBottomWidth: 2,
    borderRadius: 5,
    padding: 5,
  },
  buttoncontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  savebutton: {
    height: 50,
    width: 160,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savetext: {
    color: 'white',
    textAlign: 'center',
  },
  pfimgWrapper: {
    alignItems: 'center',
    marginTop: 30,
  },
  pfimg: {
    borderRadius: 70,
    width: 99,
    height: 97,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

