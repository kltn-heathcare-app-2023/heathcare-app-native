import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  AuthPhoneScreen,
  LoginScreen,
  RegisterScreen,
  SendInformationScreen,
  LoadingScreen,
} from '../screens/utils';
import RouterKey from '../utils/Routerkey';
import MainScreen from '../screens/main/Main';
import DoctorScreen from '../screens/doctor/DoctorScreen';
import LoadingAfterLoginScreen from '../screens/utils/LoadingAfterLogin';
import CallVideoScreen from '../screens/main/messages/call-video';
import ChatGPTScreen from '../screens/utils/ChatGPTScreen';
import PostListScreen from '../screens/utils/post/PostScreen';
import PostDetailScreen from '../screens/utils/post/PostDetailScreen';
import ForgotPasswordScreen from '../screens/utils/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={RouterKey.LOADING_SCREEN}>
      <Stack.Screen name={RouterKey.LOGIN_SCREEN} component={LoginScreen} />
      <Stack.Screen
        name={RouterKey.REGISTER_SCREEN}
        component={RegisterScreen}
      />
      <Stack.Screen
        name={RouterKey.AUTH_PHONE_SCREEN}
        component={AuthPhoneScreen}
      />
      <Stack.Screen
        name={RouterKey.SEND_IN4_SCREEN}
        component={SendInformationScreen}
      />
      <Stack.Screen
        name={RouterKey.MAIN_SCREEN}
        component={MainScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name={RouterKey.DOCTOR_SCREEN}
        component={DoctorScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name={RouterKey.LOADING_SCREEN}
        component={LoadingScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name={RouterKey.LOADING_AFTER_LOGIN_SCREEN}
        component={LoadingAfterLoginScreen}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name={RouterKey.CALL_VIDEO_SCREEN}
        component={CallVideoScreen}
      />
      <Stack.Screen
        name={RouterKey.UTILS_CHAT_GPT_SCREEN}
        component={ChatGPTScreen}
      />
      <Stack.Screen
        name={RouterKey.UTILS_POST_LIST_SCREEN}
        component={PostListScreen}
      />
      <Stack.Screen
        name={RouterKey.UTILS_POST_DETAIL_SCREEN}
        component={PostDetailScreen}
      />
      <Stack.Screen
        name={RouterKey.UTILS_FORGOT_PASS_SCREEN}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
}

function RootStackNavigator() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

export default RootStackNavigator;
