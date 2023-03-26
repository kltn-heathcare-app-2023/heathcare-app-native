import {StyleSheet} from 'react-native';
import {Image, View} from 'react-native';

import Lottie from 'lottie-react-native';
import {useEffect} from 'react';
import storage from '../../utils/storage';
import RouterKey from '../../utils/Routerkey';
import jwtDecode from 'jwt-decode';
import {useDispatch, useSelector} from 'react-redux';
import {infoSelector} from '../../redux/selectors/infoSelector';
import {fetchUserInfo} from '../../redux/slices/infoSlice';

function LoadingScreen({navigation}) {
  const user_info = useSelector(infoSelector);
  const dispatch = useDispatch();

  const init = async () => {
    const token = await storage.get('accessToken');
    if (token) {
      const decode = jwtDecode(token);
      if (decode['rule'] === 'patient') {
        dispatch(fetchUserInfo());
      } else navigation.navigate(RouterKey.ADMIN_SCREEN);
    } else {
      navigation.navigate(RouterKey.LOGIN_SCREEN);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    console.log(user_info);
    if (Object.keys(user_info).length > 0) {
      navigation.navigate(RouterKey.MAIN_SCREEN);
    }
  }, [user_info]);

  return (
    <View style={styles.container}>
      <Lottie
        source={require('../../assets/images/splash.json')}
        autoPlay
        loop
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
});

export default LoadingScreen;
