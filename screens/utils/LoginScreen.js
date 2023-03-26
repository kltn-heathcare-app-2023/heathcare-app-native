import {useCallback, useState} from 'react';
import {Alert, ImageBackground, StyleSheet, Text, View} from 'react-native';
import TextInputPrimary from '../../components/Input/InputPrimary';
import ButtonPrimary from '../../components/ButtonPrimary';
import {BACKGROUND_IMAGE} from '../../utils/image';
import ActionView from '../../components/ActionView';
import RouterKey from '../../utils/Routerkey';
import {login} from '../../services/auth';
import storage from '../../utils/storage';

import styles from '../../styles/global.js';
import jwtDecode from 'jwt-decode';

function LoginScreen({navigation}) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!(phone.trim() && password.trim())) {
      Alert.alert('Thông báo', 'Bạn phải điền đầy đủ thông tin!');
    } else {
      try {
        const resp = await login({phone_number: phone, password});
        const {data} = resp;
        if (data) {
          await storage.set('accessToken', data.accessToken);
          const decode = jwtDecode(data.accessToken);
          if (decode['rule'] === 'patient')
            navigation.navigate(RouterKey.MAIN_SCREEN);
          else navigation.navigate(RouterKey.ADMIN_SCREEN);
          setPhone('');
          setPassword('');
        }
      } catch (error) {
        const {message} = error;
        Alert.alert('Thông báo', message ?? error);
      }
    }
  };

  const handleClickRegister = () => {
    navigation.navigate(RouterKey.REGISTER_SCREEN);
  };

  const handleChangePhoneInput = useCallback(
    val => {
      // console.log(val);
      setPhone(val);
    },
    [phone],
  );

  const handleChangePassInput = useCallback(
    val => {
      // console.log(`[pass] -> ${val}`);
      setPassword(val);
    },
    [password],
  );

  return (
    <>
      <View style={styles.titleView}>
        <Text style={styles.title}>T&T HEALTHCARE</Text>
      </View>
      <ImageBackground
        source={BACKGROUND_IMAGE}
        resizeMode="cover"
        style={styles.container}>
        <TextInputPrimary
          isPhone={true}
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={handleChangePhoneInput}
        />
        <TextInputPrimary
          isPass={true}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={handleChangePassInput}
        />

        <ButtonPrimary title="Đăng nhập" handle={handleLogin} />
        <ActionView title="Đăng ký ngay" isLogin handle={handleClickRegister} />
      </ImageBackground>
    </>
  );
}

export default LoginScreen;
