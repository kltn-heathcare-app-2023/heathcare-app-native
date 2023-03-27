import {useEffect, useState} from 'react';
import {
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

function MainScreen({navigation}) {
  const [visible, setVisible] = useState(false);
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');
  const user_info = useSelector(infoSelector);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const granted =
    Platform.OS == 'android'
      ? PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.RECORD_AUDIO,
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
  }, [user_info]);

  useEffect(() => {
    socket.on('call_id_room_to_user_success', resp => {
      const {room_id, doctor_username} = resp;
      setRoom(room_id);
      setUsername(doctor_username);
      showModal();
    });
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
                  navigation.navigate(RouterKey.MESSAGE_SCREEN, {
                    screen: RouterKey.CALL_VIDEO_SCREEN,
                    params: {
                      room_id: room,
                    },
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
