import {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {fetchUserInfo} from '../../redux/slices/infoSlice';
import MainNavigator from '../../routers/MainNavigator';

import ICon from 'react-native-vector-icons/MaterialCommunityIcons';
import RouterKey from '../../utils/Routerkey';
import {socket} from '../../utils/config';

function MainScreen({navigation}) {
  const [visible, setVisible] = useState(true);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const granted =
    Platform.OS == 'android'
      ? PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.RECORD_AUDIO,
        )
      : undefined;

  const dispatch = useDispatch();

  useEffect(() => {
    granted
      .then(data => {
        if (!data) {
          const permissions = [
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.CAMERA,
          ];
          //返回得是对象类型
          PermissionsAndroid.requestMultiple(permissions);
          console.log('get permission ok!');
        }
      })
      .catch(err => {
        console.log('error get permission ->', err);
      });

    dispatch(fetchUserInfo());
  }, []);

  return (
    <>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
          <View style={styles.modal_container}>
            <View>
              <Text>Bác sĩ: BaoTran</Text>
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
                  navigation.navigate(RouterKey.CALL_VIDEO_SCREEN, {
                    room_id: '63fa3231d86212735e0f763b',
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
