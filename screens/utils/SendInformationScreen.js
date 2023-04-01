// import { Button } from "@ant-design/react-native";
import {useState} from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import * as ImagePicker from "expo-image-picker";

import ActionView from '../../components/ActionView';
import ButtonPrimary from '../../components/ButtonPrimary';
import DropDownPicker from '../../components/Input/DropdownPicker';
import TextInputPrimary from '../../components/Input/InputPrimary';
import {BACKGROUND_IMAGE} from '../../utils/image';
import DatePicker from 'react-native-neat-date-picker';
import styles from '../../styles/global.js';
import fetch from '../../utils/fetch';
import env from '../../utils/env';
import RouterKey from '../../utils/Routerkey';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import moment from 'moment';
import {Popup} from 'popup-ui';
import {MESSAGE_MISS_DATA} from '../../common/message';
export const genderItems = [
  {label: 'Nam', value: 'Nam'},
  {label: 'Nữ', value: 'Nữ'},
];

export const bloodITems = [
  {label: 'O', value: 'O'},
  {label: 'A', value: 'A'},
  {label: 'B', value: 'B'},
  {label: 'AB', value: 'AB'},
];

export const anamnesisITems = [
  {label: 'Tiền sử đường huyết: Bình thường', value: '0'},
  {label: 'Tiền sử đường huyết: Típ 1', value: '1'},
  {label: 'Tiền sử đường huyết: Típ 2', value: '2'},
];

function SendInformationScreen({navigation, route}) {
  const {name} = route.params;
  // const name = 'Le Tuan';
  const [gender, setGender] = useState('Nam');
  const [blood, setBlood] = useState('O');
  const [anamnesis, setAnamnesis] = useState('0');
  const [date, setDate] = useState(new Date());
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChooseImage = async () => {
    try {
      const image = await MultipleImagePicker.openPicker({mediaType: 'image'});
      setImage({
        uri: `file://${image[0].realPath}`,
        type: image[0].mime,
        name: image[0].fileName,
      });
    } catch (error) {
      console.log('err chooose image -> ', error);
    }
  };

  const handleUpdateIn4 = async () => {
    if (address && image) {
      const formData = new FormData();
      formData.append('username', name);
      formData.append('dob', `${date}`);
      formData.append('address', address);
      formData.append('gender', gender === 'Nam' ? true : false);
      formData.append('blood', blood);
      formData.append('avatar', image);

      fetch
        .postFormWithAuth(`/patients`, formData)
        .then(val => {
          if (val?.error) {
            Popup.show({
              type: 'Warning',
              title: 'Thông báo',
              button: true,
              textBody: `${val?.error?.message}`,
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
          Popup.show({
            type: 'Success',
            title: 'Thông báo',
            button: true,
            textBody: `Đăng ký tài khoản thành công tiến hành đăng nhập`,
            buttontext: 'OK',
            timing: 3000,
            callback: () => {
              // navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
              //   screen: RouterKey.INFO_SCREEN,
              // });
              Popup.hide();
            },
          });
          navigation.navigate(RouterKey.LOGIN_SCREEN);
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
        textBody: `${MESSAGE_MISS_DATA}`,
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

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const onCancel = () => {
    // You should close the modal in here
    setShowDatePicker(false);
  };

  const onConfirm = ({date}) => {
    // You should close the modal in here
    setShowDatePicker(false);

    // The parameter 'date' is a Date object so that you can use any Date prototype method.
    setDate(date);
  };
  return (
    <>
      <View
        style={{
          width: '100%',
          position: 'absolute',
          top: '5%',
          zIndex: 1,
        }}>
        <Text style={styles.title}>T&T HEALTHCARE</Text>
      </View>
      <ImageBackground
        source={BACKGROUND_IMAGE}
        resizeMode="cover"
        style={styles.container}>
        <TextInputPrimary
          isName={true}
          placeholder="Họ và tên"
          value={name}
          editable={false}
          selectTextOnFocus={false}
        />

        <DropDownPicker
          value={gender}
          _setValue={setGender}
          items={genderItems}
          isGender
        />

        {/* <DateTimePicker date={date} setDate={setDate} show={true} /> */}
        <DatePicker
          isVisible={showDatePicker}
          mode={'single'}
          onCancel={onCancel}
          onConfirm={onConfirm}
          startDate={new Date('2001/01/01')}
        />

        <TextInputPrimary
          isInsurance
          isDate
          value={moment(date).format('l')}
          editable={false}
          openPicker={openDatePicker}
        />

        <TextInputPrimary
          isAddress={true}
          placeholder="Địa chỉ"
          value={address}
          onChangeText={val => setAddress(val)}
        />

        <DropDownPicker
          value={blood}
          _setValue={setBlood}
          items={bloodITems}
          isBlood
        />

        <DropDownPicker
          value={anamnesis}
          _setValue={setAnamnesis}
          items={anamnesisITems}
          isBlood
        />

        <TouchableOpacity
          onPress={handleChooseImage}
          style={{
            width: '90%',
            height: 40,
            backgroundColor: '#ccc',
            marginBottom: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{alignContent: 'center'}}>Chọn ảnh</Text>
        </TouchableOpacity>
        {image && (
          <Image
            source={{uri: image.uri}}
            style={{
              width: '30%',
              height: 100,
              borderWidth: 1,
              marginBottom: 8,
              backgroundColor: '#ffcc',
            }}
            resizeMode="center"
          />
        )}
        <ButtonPrimary title="Cập nhật thông tin" handle={handleUpdateIn4} />

        <ActionView
          title="Quay lại"
          handle={() => navigation.navigate(RouterKey.REGISTER_SCREEN)}
        />
      </ImageBackground>
    </>
  );
}

export default SendInformationScreen;
