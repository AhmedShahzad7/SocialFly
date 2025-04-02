import { StyleSheet,View,Text,TextInput,Image,TouchableOpacity,ScrollView } from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FIRESTORE_DB,FIREBASE_AUTH } from "../../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
export default function Login_page(){
    const navigation = useNavigation();
    const [email,setemail]=useState('');
    const [password,setpassword]=useState('');
    const handlelogin = async () => {
        if (!email || !password) {
          alert("Fill all fields");
          return;
        }
        const testemail = email.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(testemail)) {
          alert("Please enter a valid email address");
          return;
        }
        const auth = FIREBASE_AUTH;
        await signInWithEmailAndPassword(auth,email, password);
        alert('Welcome: '+ email);
<<<<<<< HEAD
        navigation.navigate("Profile");
=======
        navigation.replace("MainApp", { screen: "Home" });
>>>>>>> 9e55bdbeefeee5dd0d782f65b4b7ee4d197b4034
        setemail('');
        setpassword('');
    }
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
            <Text style={Login_Styles.h1}>Login Into Your Account</Text>
            <Text style={Login_Styles.h2}>Welcome Back!</Text>
            </View>
            <View style={Login_Styles.Emailcontainer}>
                <TextInput style={Login_Styles.input} value={email} onChangeText={setemail} placeholder="Email" placeholderTextColor={"#384448"} />
            </View>
            <View style={Login_Styles.passwordcontainer}>
                <TextInput style={Login_Styles.input} value={password} onChangeText={setpassword} placeholder="Password" placeholderTextColor={"#384448"} secureTextEntry={true} />
            </View>
            <View style={Login_Styles.buttoncontain}>
                <TouchableOpacity onPress={handlelogin}>
            <LinearGradient colors={["#00BCD4", "#384448"]} style={Login_Styles.button}>
          <Text style={Login_Styles.buttonText}>Log In</Text>
          </LinearGradient>
          </TouchableOpacity>
          </View>
      <View style={Login_Styles.fcontain}>
        <Text style={Login_Styles.emailtext}>Forgot Password?</Text>
      </View>
      <View style={Login_Styles.footerContainer}>
        <Text style={Login_Styles.footerText}>Don’t have a account?</Text>
        <TouchableOpacity onPress={()=>navigation.navigate("SignUp")}>
          <Text style={Login_Styles.signupText}>Sign Up Now</Text>
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
        marginLeft:18,
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
        top:170,
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
        width:"75%",
    },
    Emailcontainer:{
        top:300,
        position:"absolute",
        width:"90%",
       
    },
    emailtext:{
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "regular",
        textAlign: "center",
        position:"absolute",
        
    },
    A:{
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "regular",
        textAlign: "center",
        left:"-15%",
    },
    Acontain:{
        flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position:"absolute",
    width:"90%",
    left:95,
    },
    footerContainer: {
        flexDirection: "row",
        marginTop: 620,
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
      passwordcontainer:{
        top:400,
        position:"absolute",
        width:"90%",
      },
      buttoncontain:{
        top:500,
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
    fcontain:{
        top:600,
        flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position:"absolute",
    width:"100%"
    },
   
      buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign:"center"
      },
      
});