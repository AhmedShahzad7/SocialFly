import { StyleSheet,View,Text,TextInput,Image,TouchableOpacity,ScrollView } from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Fetchemails,Fetchusername } from "../FetchData";
import { AuthService,SignUpClass } from "../AuthenticationService";
export default function SignUp_page(){
    const navi = useNavigation();
    const[datausernames,setdatausernames]=useState([]);
    const[dataemails,setdataemails]=useState([]);
    const [formData, setFormData] = useState({
      fullname:'',
      username:'',
      email:'',
      password: '',
      confirmpass:'',
    });
    const fetchData=async()=>{
        const getallusernames=new Fetchusername();
        const usernamesinfo=await getallusernames.fetchdata();
        const getallemails=new Fetchemails();
        const emailsinfo=await getallemails.fetchdata();
        setdatausernames(usernamesinfo);
        setdataemails(emailsinfo);
        }
     fetchData();
    const handlesignup=async()=>{
        if (!formData.fullname || !formData.username || !formData.email || !formData.password || !formData.confirmpass){
            alert('Fill all the feilds');
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
          alert('Please enter a valid email address');
          return;
        }
        if (formData.password!=formData.confirmpass){
            alert("Fill both Password feilds same");
            return;
        }
        if (datausernames && datausernames.includes(formData.username))
        {
          alert("Username must be unique!");
          return;
        }
        if(dataemails && dataemails.includes(formData.email))
        {
          alert("Email Address must be unique");
          return;
        }
        const SignUpInstance=new SignUpClass();
        const AuthSignup=new AuthService(SignUpInstance);
        AuthSignup.authenticate(formData);
        navi.navigate("Login");

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
               
                <TextInput style={Login_Styles.input} placeholder="Full Name" value={formData.fullname}
        onChangeText={(text)=>setFormData({...formData,fullname:text})} placeholderTextColor={"#384448"}  />
            </View>
            <View style={Login_Styles.usernamecontainer}>
               
                <TextInput style={Login_Styles.input} placeholder="Usrename" value={formData.username}
        onChangeText={(text)=>setFormData({...formData,username:text})} placeholderTextColor={"#384448"}  />
            </View>
            <View style={Login_Styles.EmailContainer}>
                
                <TextInput style={Login_Styles.input} placeholder="Email Address" value={formData.email}
        onChangeText={(text)=>setFormData({...formData,email:text})}  placeholderTextColor={"#384448"}/>
            </View>
            <View style={Login_Styles.passwordContainer}>
                
                <TextInput style={Login_Styles.input} placeholder="Password"  value={formData.password}
        onChangeText={(text)=>setFormData({...formData,password:text})} placeholderTextColor={"#384448"} secureTextEntry={true}  />
            </View>
            <View style={Login_Styles.confirmpasswordcontainer}>
                
                <TextInput style={Login_Styles.input} placeholder="Confirm Password"  value={formData.confirmpass}
        onChangeText={(text)=>setFormData({...formData,confirmpass:text})} placeholderTextColor={"#384448"} secureTextEntry={true}  />
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


