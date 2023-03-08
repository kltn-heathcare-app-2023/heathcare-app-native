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
import {useMemo, useState} from 'react';
import storage from '../utils/storage';

function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={RouterKey.LOGIN_SCREEN}>
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
    <ZegoUIKitPrebuiltCallWithInvitation
      appID={env.CALL_APP_ID}
      appSign={env.CALL_APP_SIGN_IN}
      userID={'12345'}
      userName={'Lê Tuấn'}
      ringtoneConfig={{
        incomingCallFileName: 'zego_incoming.mp3',
        outgoingCallFileName: 'zego_outgoing.mp3',
      }}
      plugins={[ZegoUIKitSignalingPlugin]} // The signaling plug-in used for call invitation must be set here.
      requireConfig={data => {
        console.warn('requireConfig', data);
        const callConfig =
          ZegoInvitationType.videoCall === data.type
            ? ONE_ON_ONE_VIDEO_CALL_CONFIG
            : ONE_ON_ONE_VOICE_CALL_CONFIG;
        return {
          ...callConfig,
        };
      }}
      notifyWhenAppRunningInBackgroundOrQuit={false}
      isIOSSandboxEnvironment={false} // Ignore this if you are not building an iOS app.
      config={{
        ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
        onOnlySelfInRoom: () => {
          navigation.goBack();
          navigation.navigate(RouterKey.HOME_SCREEN);
        },
        onHangUp: () => {
          navigation.goBack();
          navigation.navigate(RouterKey.HOME_SCREEN);
        },

        layout: {
          mode: ZegoLayoutMode.pictureInPicture,
          config: {
            showMyViewWithVideoOnly: true,
            isSmallViewDraggable: true,
            switchLargeOrSmallViewByClick: true,
          },
        },

        hangUpConfirmInfo: {
          title: 'Thông báo',
          message: 'Bạn có chắc muốn kết thúc cuộc trò chuyện',
          cancelButtonName: 'Hủy',
          confirmButtonName: 'Xác nhận',
        },
      }}>
      <NavigationContainer independent={true}>
        <StackNavigator />
      </NavigationContainer>
    </ZegoUIKitPrebuiltCallWithInvitation>
  );
}

export default RootStackNavigator;
