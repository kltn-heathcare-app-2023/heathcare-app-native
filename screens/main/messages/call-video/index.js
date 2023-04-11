import {View} from 'react-native';
import ZegoUIKitPrebuiltCall, {
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

import {ZegoLayoutMode} from '@zegocloud/zego-uikit-rn';
import RouterKey from '../../../../utils/Routerkey';
import env from '../../../../utils/env';
import {useSelector} from 'react-redux';
import {infoSelector} from '../../../../redux/selectors/infoSelector';
import {doctorProfileSelector} from '../../../../redux/selectors/doctor/infoSelector';
import {Modal, Portal} from 'react-native-paper';
import {useState} from 'react';
import {Text} from 'react-native';

function CallVideoScreen({navigation, route}) {
  const {room_id, schedule_detail_id} = route.params;
  console.log({room_id, schedule_detail_id});
  const user_info = useSelector(infoSelector);
  const doctor_profile = useSelector(doctorProfileSelector);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  return (
    <>
      <View style={{flex: 1}}>
        <ZegoUIKitPrebuiltCall
          appID={env.CALL_APP_ID}
          appSign={env.CALL_APP_SIGN_IN}
          userID={user_info?._id ?? doctor_profile?.doctor?._id}
          userName={
            user_info?.person?.username ??
            doctor_profile?.doctor?.person.username
          }
          callID={room_id}
          notifyWhenAppRunningInBackgroundOrQuit={true}
          isIOSSandboxEnvironment={false} // Ignore this if you are not building an iOS app.
          config={{
            ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
            onOnlySelfInRoom: () => {
              showModal();
              navigation.goBack();
              navigation.navigate(
                Object.keys(user_info).length > 0
                  ? RouterKey.HOME_SCREEN
                  : RouterKey.DOCTOR_HOME_SCREEN,
                {rating: true},
              );
            },
            onHangUp: () => {
              showModal();
              navigation.goBack();
              navigation.navigate(
                Object.keys(user_info).length > 0
                  ? RouterKey.HOME_SCREEN
                  : RouterKey.DOCTOR_HOME_SCREEN,
                {rating: true},
              );
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

      <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
          <Text>Example Modal. Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
    </>
  );
}

export default CallVideoScreen;
