import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Login_page from "../Tabs/Login&SignUp Screens/Login";
import SignUp_page from "../Tabs/Login&SignUp Screens/Signup";
import H from "../Tabs/Home Screen/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import C from "../Tabs/Chats Screen/chatpage";
import S from "../Tabs/Search Screen/searchpage";
import Sett from "../Tabs/Settings Screen/Settings";
import prof from "../Tabs/Profile Page Screen/ProfileScreen";
import ProfileDetailScreen from "../Tabs/Settings Screen/Profile Detail Page/ProfileDetail";
import {LinearGradient} from 'expo-linear-gradient';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Define the stack navigator as a separate function
function AuthStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login_page} />
      <Stack.Screen name="SignUp" component={SignUp_page} />
      <Stack.Screen name="prof" component={prof} />
    </Stack.Navigator>
  );
}

function BottomTabNavigator() {
  return (
    <Tab.Navigator
          screenOptions={({ route }) => ({
            // Gradient background for the tab bar
            tabBarBackground: () => (
              <LinearGradient
                colors={["#00BCD4", "#384448"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1, position: "absolute", width: "100%", height: "100%" }}
              />
            ),
            // Tab bar styles
            tabBarStyle: {
              height: 70,
              borderTopWidth: 0,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              color: "white",
              paddingBottom: 5,
            },
            tabBarActiveTintColor: "#1D7E8B",
            tabBarInactiveTintColor: "#ffffff",
            tabBarIcon: ({ focused, color }) => {
              let iconName;
    
              // Map route names to Ionicons
              if (route.name === "Settings") {
                iconName = "settings";
              } else if (route.name === "Profile Page") {
                iconName = "person";
              } else if (route.name === "Home") {
                iconName = "home";
              } else if (route.name === "Chats") {
                iconName = "chatbox";
              } else if (route.name === "Search") {
                iconName = "search";
              }
    
              return (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 20, // Circular shape
                    backgroundColor: focused ? "white" : "transparent", // Dome effect
                  }}
                >
                  <Ionicons
                    name={iconName}
                    color={focused ? "#1D7E8B" : color}
                    size={24} // Consistent icon size
                  />
                </View>
              );
            },
          })}>
        <Tab.Screen
        name="Home"
        component={H}
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Chats"
        component={C}
        options={{
          title: "Chats",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Search"
        component={S}
        options={{
          title: "Search",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Sett}
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile Page"
        component={prof}
        options={{
          title: "Profile Page",
          headerShown: false,
        }}
      />
      </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Show Auth screens first */}
        <Stack.Screen name="Auth" component={AuthStackNavigator} />
        {/* Show Bottom Tabs (including Home) after login */}
        <Stack.Screen name="MainApp" component={BottomTabNavigator} />
        <Stack.Screen name="Profile Detail" component={ProfileDetailScreen} />
      </Stack.Navigator>
  );
}