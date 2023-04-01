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
import regex from '../../common/regex';
import {Popup} from 'popup-ui';

function RegisterScreen({navigation}) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [errorInputPhone, setErrorInputPhone] = useState('');
  const [errorInputPass, setErrorInputPass] = useState('');
  const [errorConfirmPass, setErrorConfirmPass] = useState('');

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
    if (phone && password && confirmPass && name && !errorInputPhone) {
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
          Popup.show({
            type: 'Warning',
            title: 'Thông báo',
            button: true,
            textBody: `${('Thông báo', err?.message)}`,
            buttontext: 'OK',
            timing: 3000,
            callback: () => {
              // navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
              //   screen: RouterKey.INFO_SCREEN,
              // });
              Popup.hide();
            },
          });
        });
    } else {
      Popup.show({
        type: 'Warning',
        title: 'Thông báo',
        button: true,
        textBody: `${('Thông báo', 'Bạn phải điền đầy đủ thông tin!')}`,
        buttontext: 'OK',
        timing: 3000,
        callback: () => {
          // navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
          //   screen: RouterKey.INFO_SCREEN,
          // });
          Popup.hide();
        },
      });
    }
  };

  const handleChangePhoneInput = useCallback(
    val => {
      // console.log(val);
      if (val) {
        if (!regex.isValidVNPhoneNumber(val)) {
          setErrorInputPhone('Số điện thoại không hợp lệ');
        } else {
          setErrorInputPhone('');
        }
        setPhone(val);
      } else {
        setPhone(val);
        setErrorInputPhone('');
      }
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
      if (val) {
        if (val.length < 8) {
          setErrorInputPass('Mật khẩu phải lớn hơn 8 ký tự');
        } else {
          setErrorInputPass('');
        }
        setPassword(val);
      } else {
        setPassword(val);
        setErrorInputPass('');
      }
    },
    [password],
  );

  const handleChangeConfirmPassInput = useCallback(
    val => {
      if (val) {
        if (!(val === password)) {
          setErrorConfirmPass('Mật khẩu nhập lại phải giống với mật khẩu trên');
        } else {
          setErrorConfirmPass('');
        }
        setConfirmPass(val);
      } else {
        setConfirmPass(val);
        setErrorConfirmPass('');
      }
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
          error={errorInputPhone}
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
          error={errorInputPass}
        />

        <TextInputPrimary
          isPass={true}
          placeholder="Nhập lại mật khẩu"
          value={confirmPass}
          onChangeText={handleChangeConfirmPassInput}
          error={errorConfirmPass}
        />
        <ButtonPrimary
          title="Đăng ký"
          handle={handleRegister}
          // disabled={
          //   !!!errorInputPhone && !!!errorInputPass && !!!errorConfirmPass
          // }
        />
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
