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
const Stack = createNativeStackNavigator();

import {
  ZegoUIKitPrebuiltCallWithInvitation,
  ZegoInvitationType,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
  ONE_ON_ONE_VOICE_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

import {ZegoLayoutMode} from '@zegocloud/zego-uikit-rn';

import ZegoUIKitSignalingPlugin from '@zegocloud/zego-uikit-signaling-plugin-rn';
import {useSelector} from 'react-redux';
import {infoSelector} from '../redux/selectors/infoSelector';

import env from '../utils/env';
import {useEffect, useMemo, useState} from 'react';
import storage from '../utils/storage';
import jwtDecode from 'jwt-decode';

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
        name={RouterKey.LOADING_SCREEN}
        component={LoadingScreen}
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
