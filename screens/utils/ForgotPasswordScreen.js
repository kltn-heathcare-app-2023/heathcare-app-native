import {useCallback, useState} from 'react';
import {Alert, ImageBackground, StyleSheet, Text, View} from 'react-native';
import TextInputPrimary from '../../components/Input/InputPrimary';
import ButtonPrimary from '../../components/ButtonPrimary';
import {BACKGROUND_IMAGE} from '../../utils/image';
import ActionView from '../../components/ActionView';
import RouterKey from '../../utils/Routerkey';
import {forgotPassword, login} from '../../services/auth';
import storage from '../../utils/storage';

import styles from '../../styles/global.js';
import jwtDecode from 'jwt-decode';
import regex from '../../common/regex';

import {Popup} from 'popup-ui';
import {ActivityIndicator, Button} from 'react-native-paper';

function ForgotPasswordScreen({navigation}) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [errorInputPhone, setErrorInput] = useState('');
  const [errorConfirmPass, setErrorConfirmPass] = useState('');
  const [errorInputPass, setErrorInputPass] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePhoneInput = useCallback(
    val => {
      // console.log(val);
      if (val) {
        if (!regex.isValidVNPhoneNumber(val)) {
          setErrorInput('Số điện thoại không hợp lệ');
        } else {
          setErrorInput('');
        }
        setPhone(val);
      } else {
        setPhone(val);
        setErrorInput('');
      }
    },
    [phone],
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

  const handleUpdatePassword = () => {
    if (errorInputPhone) {
      Popup.show({
        type: 'Warning',
        title: 'Thông báo',
        button: true,
        textBody: `${('Thông báo', 'Vui lòng nhập số điện thoại!')}`,
        buttontext: 'OK',
        timing: 3000,
        callback: () => {
          // navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
          //   screen: RouterKey.INFO_SCREEN,
          // });
          Popup.hide();
        },
      });

      return;
    }
    if (errorInputPass) {
      Popup.show({
        type: 'Warning',
        title: 'Thông báo',
        button: true,
        textBody: `${('Thông báo', 'Vui lòng nhập mật khẩu!')}`,
        buttontext: 'OK',
        timing: 3000,
        callback: () => {
          // navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
          //   screen: RouterKey.INFO_SCREEN,
          // });
          Popup.hide();
        },
      });

      return;
    }

    if (errorConfirmPass) {
      Popup.show({
        type: 'Warning',
        title: 'Thông báo',
        button: true,
        textBody: `${
          ('Thông báo', 'Mật khẩu nhập lại phải khớp mới mật khẩu ở trên')
        }`,
        buttontext: 'OK',
        timing: 3000,
        callback: () => {
          // navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
          //   screen: RouterKey.INFO_SCREEN,
          // });
          Popup.hide();
        },
      });

      return;
    }

    setLoading(true);
    forgotPassword({phone_number: phone, password: password})
      .then()
      .catch(err => {
        Popup.show({
          type: err.status === 'success' ? 'Success' : 'Warning',
          title: 'Thông báo',
          button: true,
          textBody: `${('Thông báo', err.message)}`,
          buttontext: 'OK',
          timing: 3000,
          callback: () => {
            if (err.status === 'success') {
              navigation.navigate(RouterKey.LOGIN_SCREEN);
            }
            Popup.hide();
          },
        });

        return;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <View style={styles.titleView}>
        {/* <Text style={styles.title}>T&T HEALTHCARE</Text> */}
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
          isPass={true}
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
          title="Lấy lại mật khẩu"
          handle={handleUpdatePassword}
          disabled={loading}
        />
        {loading && (
          <ActivityIndicator
            animating={true}
            color={'#2ec4b6'}
            style={{marginTop: 16}}
          />
        )}
        <ActionView title="Quay lại" handle={() => navigation.goBack()} />
      </ImageBackground>
    </>
  );
}

export default ForgotPasswordScreen;
