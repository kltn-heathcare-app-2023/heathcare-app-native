import {useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import {fetchUserInfo} from '../../redux/slices/infoSlice';
import MainNavigator from '../../routers/MainNavigator';

function MainScreen({navigation}) {
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

  return <MainNavigator />;
}

export default MainScreen;
