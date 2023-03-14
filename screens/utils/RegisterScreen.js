import {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TextInputPrimary from '../../components/Input/InputPrimary';
import ButtonPrimary from '../../components/ButtonPrimary';
import {BACKGROUND_IMAGE} from '../../utils/image';
import ActionView from '../../components/ActionView';
import RouterKey from '../../utils/Routerkey';

import styles from '../../styles/global.js';

import auth from '@react-native-firebase/auth';
import storage from '../../utils/storage';

function RegisterScreen({navigation}) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  //function get OTP with phone number
  // const sendOTP = async () => {
  //   let phoneNumber = '+84' + phone.slice(1);
  //   try {
  //     const phoneProvider = new firebase.auth.PhoneAuthProvider();
  //     const verificationId = await phoneProvider.verifyPhoneNumber(
  //       phoneNumber,
  //       recaptchaVerifier.current,
  //     );
  //     if (verificationId) {
  //       return verificationId;
  //     }
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // };

  async function signInWithPhoneNumber() {
    let phoneNumber = '+84' + phone.slice(1);
    console.log(phoneNumber);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      console.log(confirmation);
    } catch (error) {
      console.log('error in send otp', error);
    }
  }

  const handleRegister = () => {
    if (phone && password && confirmPass && name) {
      signInWithPhoneNumber()
        .then(otp => {
          navigation.navigate(RouterKey.AUTH_PHONE_SCREEN, {
            phone,
            password,
            name,
            otp,
          });
        })
        .catch(err => console.error('bug send otp', err));
    }
    register({
      phone_number: phone,
      password: password,
      rule: 'patient',
    }).then(({data}) => {
      storage.set('accessToken', data.accessToken);
      navigation.navigate(RouterKey.SEND_IN4_SCREEN, {name});
    });
  };

  const handleChangePhoneInput = useCallback(
    val => {
      setPhone(val);
    },
    [phone],
  );

  const handleChangeNameInput = useCallback(
    val => {
      setName(val);
    },
    [name],
  );

  const handleChangePassInput = useCallback(
    val => {
      setPassword(val);
    },
    [password],
  );

  const handleChangeConfirmPassInput = useCallback(
    val => {
      setConfirmPass(val);
    },
    [confirmPass],
  );

  const handleBackLogin = () => {
    navigation.navigate(RouterKey.LOGIN_SCREEN);
  };

  return (
    <>
      {/* <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        title="Xác thực"
        cancelLabel="Hủy"
      /> */}
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
          isName={true}
          placeholder="Họ và tên"
          value={name}
          onChangeText={handleChangeNameInput}
        />

        <TextInputPrimary
          isPass={true}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={handleChangePassInput}
        />

        <TextInputPrimary
          isPass={true}
          placeholder="Nhập lại mật khẩu"
          value={confirmPass}
          onChangeText={handleChangeConfirmPassInput}
        />

        <ButtonPrimary title="Đăng ký" handle={signInWithPhoneNumber} />
        <ActionView title="Quay lại" handle={handleBackLogin} />
      </ImageBackground>
    </>
  );
}

export default RegisterScreen;
