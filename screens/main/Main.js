import {useEffect, useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserInfo} from '../../redux/slices/infoSlice';
import MainNavigator from '../../routers/MainNavigator';

import ICon from 'react-native-vector-icons/MaterialCommunityIcons';
import RouterKey from '../../utils/Routerkey';
import {socket} from '../../utils/config';
import {infoSelector} from '../../redux/selectors/infoSelector';
import storage from '../../utils/storage';
import {Root, Popup} from 'popup-ui';
import moment from 'moment';
import {useNotification} from 'react-native-internal-notification';
import IIcon from 'react-native-vector-icons/Ionicons';

function MainScreen({navigation}) {
  const [visible, setVisible] = useState(false);
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');
  const user_info = useSelector(infoSelector);
  const notificationFromSocket = useNotification();
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const granted =
    Platform.OS == 'android'
      ? PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        )
      : undefined;
  useEffect(() => {
    // storage.remove('accessToken').then(() => {});
    granted
      .then(data => {
        if (!data) {
          const permissions = [
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ];
          //返回得是对象类型
          PermissionsAndroid.requestMultiple(permissions)
            .then(data => {
              console.log('get permission ok!', data);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }
      })
      .catch(err => {
        console.log('error get permission ->', err);
      });
  }, []);

  useEffect(() => {
    user_info._id && socket.emit('status_user', user_info._id);
    user_info._id && socket.emit('add_user', user_info._id);

    if (user_info && Object.keys(user_info.metrics).length > 0) {
      //alter remind give bmi
      const now = new Date();
      if (now.getHours() > 9 && user_info.metrics?.last_bmi) {
        const now_day = new Date();
        const last_bmi_created = new Date(
          user_info.metrics?.last_bmi.createdAt,
        );

        if (
          now_day.getMonth() === last_bmi_created.getMonth()
            ? now_day.getDate() > last_bmi_created.getDate()
            : now_day.getMonth() > last_bmi_created.getMonth()
        ) {
          Popup.show({
            type: 'Warning',
            title: 'Nhắc nhở',
            button: true,
            textBody:
              'Hình như, bạn chưa nhập chỉ số BMI cho hôm nay. Nhập ngay nào!',
            buttontext: 'Nhập ngay',
            callback: () => {
              navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
                screen: RouterKey.INFO_BMI_SCREEN,
              });
              Popup.hide();
            },
          });
        }
      }

      if (
        now.getHours() > 6 &&
        now.getHours() <= 8 &&
        user_info.metrics?.glycemic
      ) {
        const now_day = new Date();
        const last_glycemic_created = new Date(
          user_info.metrics?.glycemic.createdAt,
        );

        if (
          now_day.getMonth() === last_glycemic_created.getMonth()
            ? now_day.getDate() > last_glycemic_created.getDate()
            : now_day.getMonth() > last_glycemic_created.getMonth() &&
              user_info.metrics?.glycemic.case != 1
        ) {
          Popup.show({
            type: 'Warning',
            title: 'Nhắc nhở',
            button: true,
            textBody:
              'Hình như, bạn chưa nhập chỉ số đường huyết trước bữa ăn. Nhập ngay nào!',
            buttontext: 'Nhập ngay',
            callback: () => {
              navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
                screen: RouterKey.GLYCEMIC_SCREEN,
              });
              Popup.hide();
            },
          });
        }
      }

      if (
        now.getHours() > 8 &&
        now.getHours() < 11 &&
        user_info.metrics?.glycemic
      ) {
        const now_day = new Date();
        const last_glycemic_created = new Date(
          user_info.metrics?.glycemic.createdAt,
        );

        if (
          (now_day.getMonth() === last_glycemic_created.getMonth()
            ? now_day.getDate() > last_glycemic_created.getDate()
            : now_day.getMonth() > last_glycemic_created.getMonth()) &&
          user_info.metrics?.glycemic.case != 2
        ) {
          Popup.show({
            type: 'Warning',
            title: 'Nhắc nhở',
            button: true,
            textBody:
              'Hình như, bạn chưa nhập chỉ số đường huyết sau bữa ăn. Nhập ngay nào!',
            buttontext: 'Nhập ngay',
            callback: () => {
              navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
                screen: RouterKey.GLYCEMIC_SCREEN,
              });
              Popup.hide();
            },
          });
        }
      }

      if (
        now.getHours() > 21 &&
        now.getHours() < 22 &&
        user_info.metrics?.glycemic
      ) {
        const now_day = new Date();
        const last_glycemic_created = new Date(
          user_info.metrics?.glycemic.createdAt,
        );

        if (
          (now_day.getMonth() === last_glycemic_created.getMonth()
            ? now_day.getDate() > last_glycemic_created.getDate()
            : now_day.getMonth() > last_glycemic_created.getMonth()) &&
          user_info.metrics?.glycemic.case != 3
        ) {
          Popup.show({
            type: 'Warning',
            title: 'Nhắc nhở',
            button: true,
            textBody:
              'Hình như, bạn chưa nhập chỉ số đường huyết trước khi ngủ. Nhập ngay nào!',
            buttontext: 'Nhập ngay',
            callback: () => {
              navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
                screen: RouterKey.GLYCEMIC_SCREEN,
              });
              Popup.hide();
            },
          });
        }
      }

      if (
        now.getHours() > 20 &&
        now.getHours() < 22 &&
        user_info.metrics?.last_blood_pressures
      ) {
        const now_day = new Date();
        const last_blood_pressures_created = new Date(
          user_info.metrics?.last_blood_pressures.createdAt,
        );

        if (
          (now_day.getMonth() === last_blood_pressures_created.getMonth()
            ? now_day.getDate() > last_blood_pressures_created.getDate()
            : now_day.getMonth() > last_blood_pressures_created.getMonth()) &&
          user_info.metrics?.last_blood_pressures
        ) {
          Popup.show({
            type: 'Warning',
            title: 'Nhắc nhở',
            button: true,
            textBody:
              'Hình như, bạn chưa nhập chỉ số  huyết áp cho ngày hôm nay. Nhập ngay nào!',
            buttontext: 'Nhập ngay',
            callback: () => {
              navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
                screen: RouterKey.BLOOD_SCREEN,
              });
              Popup.hide();
            },
          });
        }
      } else if (!user_info.metrics?.last_blood_pressures) {
        Popup.show({
          type: 'Warning',
          title: 'Nhắc nhở',
          button: true,
          textBody:
            'Hình như, bạn chưa nhập chỉ số  huyết áp lần nào. Nhập ngay nào!',
          buttontext: 'Nhập ngay',
          callback: () => {
            navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
              screen: RouterKey.BLOOD_SCREEN,
            });
            Popup.hide();
          },
        });
      }
    } else {
      Popup.show({
        type: 'Success',
        title: 'Xin chào',
        button: true,
        textBody:
          'Chào bạn, để các bác sĩ có thể hiểu rõ hơn tình trạng của bạn. Vui lòng nhập các chỉ số',
        buttontext: 'Nhập ngay',
        callback: () => {
          navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
            screen: RouterKey.INFO_SCREEN,
          });
          Popup.hide();
        },
      });
    }
  }, [user_info]);

  useEffect(() => {
    socket.on('call_id_room_to_user_success', resp => {
      const {room_id, doctor_username} = resp;
      setRoom(room_id);
      setUsername(doctor_username);
      showModal();
    });
    socket.on(
      'notification_confirm_register_schedule_success',
      notification => {
        notificationFromSocket.showNotification({
          title: 'Thông báo',
          message: notification.content,
          icon: <IIcon name={'notifications-outline'} size={24} />,
          color: '#fff',
          onPress: () => navigation.navigate(RouterKey.NOTIFICATION_SCREEN),
        });
      },
    );
  }, []);

  return (
    <>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
          <View style={styles.modal_container}>
            <View>
              <Text>Bác sĩ: {username}</Text>
            </View>

            <View style={styles.action_view}>
              <ICon
                name={'camera'}
                size={24}
                color={'#ffff'}
                style={{
                  backgroundColor: '#2ec4b6',
                  padding: 8,
                  borderRadius: 50,
                }}
                onPress={() => {
                  console.log('call');
                  navigation.navigate(RouterKey.CALL_VIDEO_SCREEN, {
                    room_id: room,
                  });
                  setVisible(false);
                }}
              />
              <ICon
                name={'phone-cancel-outline'}
                size={24}
                color={'#ffff'}
                style={{
                  backgroundColor: '#db3a34',
                  padding: 8,
                  borderRadius: 50,
                }}
                onPress={() => {
                  setVisible(false);
                }}
              />
            </View>
          </View>
        </Modal>
      </Portal>
      <MainNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  modal_container: {
    height: 80,
    backgroundColor: '#ffff',
    borderRadius: 16,
    padding: 8,
    margin: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  action_view: {
    width: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accept_call: {
    width: 40,
    height: 40,
    backgroundColor: '#0000',
    borderRadius: 10,
  },
});

export default MainScreen;
