import { React ,useState,useEffect} from 'react';
import { View, Text, StyleSheet,TouchableOpacity,TextInput,Image,FlatList} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {collection, query, where, getDocs, updateDoc, arrayUnion,getDoc,doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FIRESTORE_DB } from '../../../FirebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
export default function Message({route}) {
    const {currentfriend,currentfriendprofileimage}=route.params;
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const [currentuser,setuser]=useState('');
    const fetchusername=async()=>{
    const auth = getAuth();
    const currentUser = auth.currentUser;

    
    const userDocument = await getDoc(doc(FIRESTORE_DB, 'Users', currentUser.uid));
    const username = userDocument.data().username;
    setuser(username);
    };
    useEffect(() => {
        fetchusername();
    }, []);

    const handleSendMessage = async () => {
        if (messageText.trim() === '') return;
      
        const newMessage = {
          text: messageText,
          sender: currentuser,
          receiver: currentfriend,
          timestamp: new Date(),
        };
      
          const userToFriendQuery = query(
            collection(FIRESTORE_DB, 'Friends'),
            where('username', '==', currentuser),
            where('friendname', '==', currentfriend)
          );
          const userToFriendSnapshot = await getDocs(userToFriendQuery);
      
          userToFriendSnapshot.forEach(async (docSnap) => {
            const docRef = docSnap.ref;
            await updateDoc(docRef, {
              messages: arrayUnion(newMessage)
            });
          });
      
          const friendToUserQuery = query(
            collection(FIRESTORE_DB, 'Friends'),
            where('username', '==', currentfriend),
            where('friendname', '==', currentuser)
          );
          const friendToUserSnapshot = await getDocs(friendToUserQuery);
      
          friendToUserSnapshot.forEach(async (docSnap) => {
            const docRef = docSnap.ref;
            await updateDoc(docRef, {
              messages: arrayUnion(newMessage)
            });
          });
      
          setMessageText(''); 
          await fetchmessages();
      };
      const fetchmessages=async()=>{
        const messagesquery = 
            query(
              collection(FIRESTORE_DB, "Friends"),
              where('username', '==', currentuser),
            where('friendname', '==', currentfriend)
            );
          const messagessnapshot= await getDocs(messagesquery);
          if (!messagessnapshot.empty) {
            const userDocData = messagessnapshot.docs[0].data();
            const msgs = userDocData.messages || [];
            msgs.sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);

            setMessages(msgs);
        }

      };
      useEffect(() => {
        if (currentuser) {
            fetchmessages();
        }
    }, [currentuser]);
    
  return (
    <View style={styles.main}>
    <View style={styles.topbar}>
        <View style={styles.GroupimgContainer}>
        <Image
                 source={{ uri: currentfriendprofileimage }}
                  style={styles.profileima}
                />
            <Text style={styles.Gname}>{currentfriend}</Text>
        </View>
    </View>
    <FlatList
            contentContainerStyle={styles.scrollContainer}
            style={styles.scrollView}
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
                <View style={styles.messageContainer} key={index}>
                <LinearGradient colors={['#00BCD4', '#FFFFFF']} style={styles.messageContainer}>
                    <Text style={{ color: 'black', padding: 5, fontWeight: 'bold' }}>{item.sender}</Text>
                    <Text style={{ color: 'black', padding: 5 }}>{item.text}</Text>
                </LinearGradient>
                </View>
            )}
            />

    <View style={styles.bottombar} >
        <TextInput style={styles.messagesinput} placeholder='Text Message'  value={messageText}
    onChangeText={text => setMessageText(text)}/>
        <TouchableOpacity onPress={handleSendMessage} >
            <Ionicons style={{right:0,color:'#00BCD4', alignItems:'center',justifyContent:'center',marginTop:10,marginLeft:10}} name='send' size={24} />
        </TouchableOpacity>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
    main:{
        flex:1,
        paddingTop:'50'
        },
        topbar:{
        position: 'absolute',   
        top: 0,
        left: 0,
        right: 0,
        height:105,
        borderBottomColor:"#00BCD4",
        borderBottomWidth:2,
        backgroundColor:"white",
        zIndex: 10,
        },
        GroupimgContainer:{
        flexDirection: 'row',      
        alignItems: 'center', 
        marginTop:45,
        marginLeft:10,
        },

        Gname: {
            marginLeft: 20,             
            fontSize: 20,               
            color: 'black',             
            fontWeight:'bold'
        },
        scrollContainer: {
            paddingTop: 120, 
            paddingBottom:80,
            paddingLeft:10,
            paddingRight:10
          },
          scrollView: {
            flex: 1,
            paddingBottom: 10,
        },
        bottombar:{
            height:60,
        width:'100%',
        backgroundColor:'white',
        borderTopColor:"#00BCD4",
        borderTopWidth:2,
        // borderTopLeftRadius:20,
        // borderTopRightRadius:20,
        flexDirection:'row',
        alignItems:'centre',
       padding:10,
        
        position:'absolute',
        bottom:0,
        zIndex: 10,
        },
        messagesinput:{
            height:40,
            width:'90%',
            borderColor:"#00BCD4",
            borderWidth:1,
            padding:10,
            color:"#00BCD4",
            borderRadius:15
        },
        messageContainer:{
            borderColor:'white',
            borderWidth:1,
            width:'100%',
            borderRadius:15
        },
        profileima: {
            width: 50,
            height: 50,
            borderRadius: 25, 
          },
});
