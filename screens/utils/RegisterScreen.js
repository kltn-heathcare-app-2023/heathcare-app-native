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
import {register} from '../../services/auth';
import {Alert} from 'react-native';
import {TITLE_NOTIFICATION} from '../../common/title';

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

  const signInWithPhoneNumber = () => {
    let phoneNumber = '+84' + phone.slice(1);
    return auth().signInWithPhoneNumber(phoneNumber);
  };

  const handleRegister = () => {
    if (phone && password && confirmPass && name) {
      // signInWithPhoneNumber();
      // .then(confirm => {
      //   navigation.navigate(RouterKey.AUTH_PHONE_SCREEN, {
      //     phone,
      //     password,
      //     name,
      //     confirm,
      //   });
      // })
      // .catch(err => console.error('bug send otp', err));

      register({
        phone_number: phone,
        password: password,
        rule: 'patient',
      })
        .then(({data}) => {
          storage.set('accessToken', data.accessToken);
          navigation.navigate(RouterKey.SEND_IN4_SCREEN, {name});
        })
        .catch(err => {
          Alert.alert(TITLE_NOTIFICATION, err?.message);
        });
    }
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
      <View style={_styles.titleView}>
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
          cre
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

        <ButtonPrimary title="Đăng ký" handle={handleRegister} />
        <ActionView title="Quay lại" handle={handleBackLogin} />
      </ImageBackground>
    </>
  );
}

const _styles = StyleSheet.create({
  titleView: {
    width: '100%',
    position: 'absolute',
    top: '10%',
    zIndex: 1,
  },
});

export default RegisterScreen;
