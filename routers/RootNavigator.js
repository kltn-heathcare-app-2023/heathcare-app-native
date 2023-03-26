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
