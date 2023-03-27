import {StyleSheet} from 'react-native';
import {Image, View} from 'react-native';

import Lottie from 'lottie-react-native';
import {useEffect, useState} from 'react';
import storage from '../../utils/storage';
import RouterKey from '../../utils/Routerkey';
import jwtDecode from 'jwt-decode';
import {useDispatch, useSelector} from 'react-redux';
import {infoSelector} from '../../redux/selectors/infoSelector';
import {fetchUserInfo} from '../../redux/slices/infoSlice';
import {fetchInfoDoctor} from '../../redux/slices/doctor/doctorInfoSlice';
import {doctorProfileSelector} from '../../redux/selectors/doctor/infoSelector';

function LoadingScreen({navigation, route}) {
  const user_info = useSelector(infoSelector);
  const doctor_profile = useSelector(doctorProfileSelector);
  const dispatch = useDispatch();

  const init = async () => {
    const token = await storage.get('accessToken');
    if (token) {
      const decode = jwtDecode(token);
      if (decode['rule'] === 'patient') {
        dispatch(fetchUserInfo());
      } else {
        dispatch(fetchInfoDoctor());
      }
    } else {
      navigation.navigate(RouterKey.LOGIN_SCREEN);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (Object.keys(user_info).length > 0) {
      navigation.navigate(RouterKey.MAIN_SCREEN);
    }
    if (Object.keys(doctor_profile).length > 0) {
      navigation.navigate(RouterKey.DOCTOR_SCREEN);
    }
  }, [user_info, doctor_profile]);

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
