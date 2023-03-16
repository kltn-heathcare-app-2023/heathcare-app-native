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
import moment from 'moment';

const genderItems = [
  {label: 'Nam', value: 'Nam'},
  {label: 'Nữ', value: 'Nữ'},
];

const bloodITems = [
  {label: 'O', value: 'O'},
  {label: 'A', value: 'A'},
  {label: 'B', value: 'B'},
  {label: 'AB', value: 'AB'},
];

function SendInformationScreen({navigation, route}) {
  // const { name } = route.params;
  const name = 'Le Tuan';
  const [gender, setGender] = useState('Nam');
  const [blood, setBlood] = useState('O');
  const [date, setDate] = useState(new Date());
  const [address, setAddress] = useState('');
  const [insurance, setInsurance] = useState('');
  const [image, setImage] = useState(null);

  //   const pickImage = async () => {
  //     // No permissions request is necessary for launching the image library
  //     let result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.All,
  //       // allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });

  //     if (!result.canceled) {
  //       console.log(result.assets[0]);
  //       setImage(result.assets[0]);
  //     }
  //   };

  const handleUpdateIn4 = () => {
    const localUri = image.uri;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    const formData = new FormData();
    formData.append('username', name);
    formData.append('dob', `${date}`);
    formData.append('address', address);
    formData.append('gender', gender === 'Nam' ? true : false);
    formData.append('blood', blood);
    formData.append('avatar', {
      uri: localUri,
      name: filename,
      type: 'image/jpeg',
    });

    fetch
      .postFormWithAuth(`${env.API_URL}/patients`, formData)
      .then(val => console.log('value -> ', val))
      .catch(err => console.log('err -> ', err));
    // console.info(name, gender, date, address, blood, image);
  };

  const [showDatePicker, setShowDatePicker] = useState(false);

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

        <TouchableOpacity
          onPress={() => {}}
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
        {/* 
        <Image
          source={{uri: image && image.uri}}
          style={{
            width: '90%',
            height: 200,
            borderWidth: 1,
            marginBottom: 8,
          }}
          resizeMode="contain"
        /> */}
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
