import {View} from 'react-native';
import ZegoUIKitPrebuiltCallWithInvitation, {
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

import ZegoUIKitSignalingPlugin from '@zegocloud/zego-uikit-signaling-plugin-rn';
import {ZegoLayoutMode} from '@zegocloud/zego-uikit-rn';
import RouterKey from '../../../../utils/Routerkey';
import env from '../../../../utils/env';

function CallVideoScreen({navigation}) {
  randomUserID = String(Math.floor(Math.random() * 100000));

  return (
    <View style={{flex: 1}}>
      <ZegoUIKitPrebuiltCallWithInvitation
        appID={env.CALL_APP_ID}
        appSign={env.CALL_APP_SIGN_IN}
        userID={'123456'}
        userName={'Lê Tuấn'}
        // callID="123456"
        // ringtoneConfig={{
        //   incomingCallFileName: 'zego_incoming.mp3',
        //   outgoingCallFileName: 'zego_outgoing.mp3',
        // }}
        plugins={[ZegoUIKitSignalingPlugin]} // The signaling plug-in used for call invitation must be set here.
        requireConfig={data => {
          console.warn('requireConfig', data);
          const callConfig =
            data.invitees.length > 1
              ? ZegoInvitationType.videoCall === data.type
                ? GROUP_VIDEO_CALL_CONFIG
                : GROUP_VOICE_CALL_CONFIG
              : ZegoInvitationType.videoCall === data.type
              ? ONE_ON_ONE_VIDEO_CALL_CONFIG
              : ONE_ON_ONE_VOICE_CALL_CONFIG;
          return {
            ...callConfig,
          };
        }}
        notifyWhenAppRunningInBackgroundOrQuit={true}
        isIOSSandboxEnvironment={false} // Ignore this if you are not building an iOS app.
        // config={{
        //   ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
        //   onOnlySelfInRoom: () => {
        //     navigation.goBack();
        //     navigation.navigate(RouterKey.HOME_SCREEN);
        //   },
        //   onHangUp: () => {
        //     navigation.goBack();
        //     navigation.navigate(RouterKey.HOME_SCREEN);
        //   },

        //   layout: {
        //     mode: ZegoLayoutMode.pictureInPicture,
        //     config: {
        //       showMyViewWithVideoOnly: true,
        //       isSmallViewDraggable: true,
        //       switchLargeOrSmallViewByClick: true,
        //     },
        //   },

        //   hangUpConfirmInfo: {
        //     title: 'Thông báo',
        //     message: 'Bạn có chắc muốn kết thúc cuộc trò chuyện',
        //     cancelButtonName: 'Hủy',
        //     confirmButtonName: 'Xác nhận',
        //   },
        // }}
      />
    </View>
  );
}

export default CallVideoScreen;
