import { StyleSheet, Text, View } from "react-native";
import Login_page from "../Tabs/Login&SignUp Screens/Login";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer,NavigationIndependentTree } from "@react-navigation/native";
import SignUp_page from "../Tabs/Login&SignUp Screens/Signup";
import H from "../Tabs/Home Screen/Home";
import Profile from "../Tabs/Profile Screen/Profile";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login_page} />
        <Stack.Screen name="SignUp" component={SignUp_page} />
        <Stack.Screen name="Home" component={H} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
  );
}
