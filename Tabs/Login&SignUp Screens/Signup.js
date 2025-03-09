import { StyleSheet,View,Text,TextInput,Image,TouchableOpacity,ScrollView } from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FIRESTORE_DB,FIREBASE_AUTH } from "../../FirebaseConfig";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
export default function SignUp_page(){
    const navi = useNavigation();
    const [fullname,setfullname]=useState('');
    const [username,setusername]=useState('');
    const [email,setemail]=useState('');
    const [password,setpassword]=useState('');
    const [confirmpass,setconfirmpass]=useState('');
   
    const handlesignup=async()=>{
        if (!fullname || !username || !email || !password || !confirmpass){
            alert("Fill all fields");
            return;
        }
        const testemail = email.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(testemail)) {
          alert("Please enter a valid email address");
          return;
        }
        if (password!=confirmpass){
            alert("Fill both Password feilds same");
            return;

        }
        const names=collection(FIRESTORE_DB,"Users");
        const snapshot=await getDocs(names);
        const allusernames=snapshot.docs.map((doc)=>doc.data().username);
        const allemails=snapshot.docs.map((doc)=>doc.data().email);
        if (allusernames.includes(username)) {
            alert("Username must be unique!");
            return;
        }

        if (allemails.includes(email)) {
            alert("Email Address must be unique");
            return;
        }
        const auth = FIREBASE_AUTH;
        const userinfo = await createUserWithEmailAndPassword(auth, email, password);
        const user = userinfo.user;
        await setDoc(doc(FIRESTORE_DB, "Users", user.uid), {
            fullName: fullname,
            username: username,
            email: email,
            password: password,
            createdAt: new Date(),
        });
        navi.navigate("Login");
        setfullname('');
        setusername('');
        setemail('');
        setpassword('');
        setconfirmpass('');

    }
    const navigation = useNavigation();
    return(
        <View style={Login_Styles.gradientContainer}>
        <ScrollView contentContainerStyle={Login_Styles.scrollContainer}>
        <View style={Login_Styles.maincontainer}> 
            <View style={Login_Styles.logocontainer}>
            <Image source={require('./Logo.png')} style={Login_Styles.logoimage}/>
            <Text style={Login_Styles.logotext}>Social Fly</Text>
            </View>
        <LinearGradient colors={["#00BCD4", "#384448"]} style={Login_Styles.mainstyle}>
            <View style={Login_Styles.headingcontainer}>
            <Text style={Login_Styles.h1}>Join SocialFly</Text>
            <Text style={Login_Styles.h2}>Stay Connected, Stay Social</Text>
            </View>
            <View style={Login_Styles.fullnamecontainer}>
               
                <TextInput style={Login_Styles.input} placeholder="Full Name" value={fullname} onChangeText={setfullname} placeholderTextColor={"#384448"}  />
            </View>
            <View style={Login_Styles.usernamecontainer}>
               
                <TextInput style={Login_Styles.input} placeholder="UserName" value={username} onChangeText={setusername} placeholderTextColor={"#384448"}  />
            </View>
            <View style={Login_Styles.EmailContainer}>
                
                <TextInput style={Login_Styles.input}  placeholder="Email" value={email} onChangeText={setemail} placeholderTextColor={"#384448"}/>
            </View>
            <View style={Login_Styles.passwordContainer}>
                
                <TextInput style={Login_Styles.input} placeholder="Password" value={password} onChangeText={setpassword} placeholderTextColor={"#384448"} secureTextEntry={true}  />
            </View>
            <View style={Login_Styles.confirmpasswordcontainer}>
                
                <TextInput style={Login_Styles.input} placeholder="Confirm Password" value={confirmpass} onChangeText={setconfirmpass} placeholderTextColor={"#384448"} secureTextEntry={true}  />
            </View>
            <View style={Login_Styles.buttoncontain}>
                <TouchableOpacity onPress={handlesignup}>
            <LinearGradient colors={["#00BCD4", "#384448"]} style={Login_Styles.button}>
          <Text style={Login_Styles.buttonText}>Sign Up</Text>
          </LinearGradient>
          </TouchableOpacity>
          </View>
     
      <View style={Login_Styles.footerContainer}>
        <Text style={Login_Styles.footerText}>Already have a account?</Text>
        <TouchableOpacity onPress={()=>navigation.navigate("Login")}>
          <Text style={Login_Styles.signupText}> Login</Text>
        </TouchableOpacity>
      </View>
      </LinearGradient>
        </View> 
        </ScrollView>
        </View>
    );
}
const Login_Styles=StyleSheet.create({
    gradientContainer: {
        flex: 1, 
        backgroundColor:"#384448",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
       
    },
    maincontainer: {
        flex: 1,
        backgroundColor: "#ffffff",
        width: "100%",
    },
   
    mainstyle:{
        flex: 1,
        borderTopLeftRadius: 450,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    logoimage:{
        position:"absolute",
        height:100,
        width:100,
        top:-90
    },
    logocontainer:{
        top:100,
        left:10,
        position:"absolute",
        width:"90%"
    },
    logotext:{
        top:20,
        left:18,
        position:"absolute",
    },
    h1:{
        color: "#384448",
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        width:"75%",
        
    },
    headingcontainer:{
        top:130,
        flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position:"absolute"
    },
    h2:{
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "regular",
        textAlign: "center",
        width:"100%",
       
    },
    fullnamecontainer:{
        top:230,
        position:"absolute",
        width:"90%",
       
    },
    fullnametext:{
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "regular",
        textAlign: "center",
        position:"absolute",
        left:"8%"
    },
    
    footerContainer: {
        flexDirection: "row",
        marginTop: 750,
      },
      footerText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "regular",
      },
      signupText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        marginLeft: 5,
        fontSize: 16,
        textDecorationLine: "underline",
      },
    input: {
        padding: 15,
        borderRadius: 20,
        backgroundColor: "#ffffff",
        color: "#00BCD4",
        top:35,
        width:"100%",
        flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position:"absolute"
      },
      usernamecontainer:{
        top:320,
        position:"absolute",
        width:"90%",
      },
      EmailContainer:{
        top:410,
        position:"absolute",
        width:"90%",

      },
      passwordContainer:{
        top:500,
        position:"absolute",
        width:"90%",
      },
      confirmpasswordcontainer:{
        top:590,
        position:"absolute",
        width:"90%",
      },
      buttoncontain:{
        top:690,
        flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position:"absolute",

      },
      button: {
         width: 150,          
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#00BCD4",
    borderColor: "#384448",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    },
      buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign:"center"
      },
      
});