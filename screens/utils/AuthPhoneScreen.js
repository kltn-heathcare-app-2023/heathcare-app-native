import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ActionView from '../../components/ActionView/index.js';
import ButtonPrimary from '../../components/ButtonPrimary/index.js';
import TextInputPrimary from '../../components/Input/InputPrimary/index.js';
import styles from '../../styles/global.js';
import {BACKGROUND_IMAGE} from '../../utils/image.js';
import {useState} from 'react';
import {register} from '../../services/auth/index.js';
import {Alert} from 'react-native';
import {TITLE_ERROR, TITLE_NOTIFICATION} from '../../common/title.js';
import RouterKey from '../../utils/Routerkey.js';
import storage from '../../utils/storage.js';
import auth from '@react-native-firebase/auth';
function AuthPhoneScreen({navigation, route}) {
  const {phone, password, name, confirm} = route.params;
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const goBack = () => {
    navigation.goBack();
  };

  const hideKeyBoard = () => {
    Keyboard.dismiss();
  };

  const handleAuthenticationAndRegisterAccount = () => {
    console.log(phone, password, verificationCode);
    // const credential = auth.PhoneAuthProvider.credential(
    //   confirm.verificationId,
    //   verificationCode,
    // );
    // auth()
    //   .currentUser.linkWithCredential(credential)
    //   .then(value => {
    //     const data = {
    //       phone_number: phone,
    //       password: password,
    //       rule: 'patient',
    //     };
    //     console.log('data send -> ', data);
    //     register(data)
    //       .then(resp => {
    //         console.log('resp receiver -> ', resp);
    //         storage.set('accessToken', resp.data.accessToken);
    //         navigation.navigate(RouterKey.SEND_IN4_SCREEN, {name});
    //       })
    //       .catch(err => {
    //         Alert.alert(TITLE_NOTIFICATION, `Đăng ký thất bại -> ${err}`);
    //       });
    //   })
    //   .catch(error => {
    //     if (error.code == 'auth/invalid-verification-code') {
    //       console.log('Invalid code.');
    //     } else {
    //       console.log('Account linking error', error);
    //     }
    //   });
    // if (auth().currentUser) auth().currentUser.delete();
    setLoading(true);
    confirm
      .confirm(verificationCode)
      .then(value => {
        const data = {
          phone_number: phone,
          password: password,
          rule: 'patient',
        };
        console.log('data send -> ', data);
        register(data)
          .then(resp => {
            console.log('resp receiver -> ', resp);
            storage.set('accessToken', resp.data.accessToken);
            navigation.navigate(RouterKey.SEND_IN4_SCREEN, {name});
          })
          .catch(err => {
            Alert.alert(
              TITLE_NOTIFICATION,
              `Đăng ký thất bại -> ${JSON.stringify(err)}`,
            );
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(err => {
        setLoading(false);
        Alert.alert(TITLE_ERROR, `Xác thực thất bại -> ${err}`);
      });
  };

  return (
    <>
      <ImageBackground
        source={BACKGROUND_IMAGE}
        resizeMode="cover"
        style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.title} onPress={hideKeyBoard}>
            T&T HEALTHCARE
          </Text>
          <Text style={_styles.subTitle}>
            Nhập OTP được gửi tới số điện thoại của bạn
          </Text>
          <Text style={_styles.phone}>{phone}</Text>
        </View>

        <TextInputPrimary
          isPhone={true}
          placeholder="Mã xác thực"
          value={verificationCode}
          onChangeText={val => setVerificationCode(val)}
          style={{marginTop: 100}}
        />
        <ButtonPrimary
          title="Xác thực"
          handle={handleAuthenticationAndRegisterAccount}
          disabled={loading}
        />
        {loading && (
          <ActivityIndicator
            animating={true}
            color={'#fb8500'}
            style={{marginTop: 16}}
            size={'large'}
          />
        )}
        <ActionView title="Quay lại" handle={goBack} />
      </ImageBackground>
    </>
  );
}

const _styles = new StyleSheet.create({
  subTitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#001219',
    marginTop: 16,
  },
  phone: {
    marginTop: 8,
    fontSize: 18,
    textAlign: 'center',
    color: '#001219',
    fontWeight: '600',
  },
});
export default AuthPhoneScreen;
