import {View} from 'react-native';
import ZegoUIKitPrebuiltCall, {
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

import {ZegoLayoutMode} from '@zegocloud/zego-uikit-rn';
import RouterKey from '../../../../utils/Routerkey';
import env from '../../../../utils/env';

function CallVideoScreen({navigation}) {
  randomUserID = String(Math.floor(Math.random() * 100000));

  return (
    <View style={{flex: 1}}>
      <ZegoUIKitPrebuiltCall
        appID={env.CALL_APP_ID}
        appSign={env.CALL_APP_SIGN_IN}
        userID={randomUserID}
        userName={'Lê Tuấn'}
        callID="123456"
        notifyWhenAppRunningInBackgroundOrQuit={true}
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
        }}
      />
    </View>
  );
}

export default CallVideoScreen;
