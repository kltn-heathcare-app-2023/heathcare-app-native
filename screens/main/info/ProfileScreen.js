import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {View, Text} from 'react-native';
import {Button, List, Modal, Portal} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {infoSelector} from '../../../redux/selectors/infoSelector';
import RouterKey from '../../../utils/Routerkey';
import Lottie from 'lottie-react-native';
import {useState} from 'react';
import TextInputPrimary from '../../../components/Input/InputPrimary';
import DropDownPicker from '../../../components/Input/DropdownPicker';
import DatePicker from 'react-native-neat-date-picker';
import {
  anamnesisITems,
  bloodITems,
  genderItems,
} from '../../utils/SendInformationScreen';
import moment from 'moment';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import fetch from '../../../utils/fetch';
import {infoSlice} from '../../../redux/slices/infoSlice';
import Header from '../../../components/Header';

function ProfilePatientScreen({navigation}) {
  const user_info = useSelector(infoSelector);
  const {person, blood, anamnesis, doctor_blood_id, doctor_glycemic_id} =
    user_info;

  const [visible, setVisible] = useState(false);
  const [name, setName] = useState(person.username);
  const [gender, setGender] = useState('Nam');
  const [date, setDate] = useState(new Date(person.dob));
  const [address, setAddress] = useState(person.address);
  const [_blood, setBlood] = useState(blood);
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const dispatch = useDispatch();

  const handleViewDoctorInfo = () => {
    console.log('click ', doctor_glycemic_id);
    navigation.navigate(RouterKey.PATIENT_INFO_DOCTOR_SCREEN, {
      schedule: {doctor: doctor_glycemic_id},
    });
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

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

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
    const formData = new FormData();
    formData.append('username', name);
    formData.append('dob', `${date}`);
    formData.append('address', address);
    formData.append('gender', gender === 'Nam' ? true : false);
    formData.append('blood', blood);
    if (image) {
      formData.append('avatar', image);
    }

    fetch
      .putFormWithAuth(`/patients/${user_info._id}`, formData)
      .then(val => {
        if (val?.error) {
          console.log('value -> ', val);
        }
        console.log(val);
        dispatch(infoSlice.actions.updateUserInfoAfterChange(val.data));
        hideModal();
      })
      .catch(err => console.log('err -> ', err));
  };

  return (
    <>
      <Header
        handle={() => navigation.navigate(RouterKey.INFO_SCREEN)}
        title={'Thông tin cá nhân'}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          {person?.avatar && (
            <Image source={{uri: person.avatar}} style={styles.header_image} />
          )}
          <TouchableOpacity onPress={showModal}>
            <Lottie
              source={require('../../../assets/images/update-info.json')}
              autoPlay
              loop
              style={{
                width: 32,
                height: 32,
                marginRight: 24,
              }}
            />
          </TouchableOpacity>
        </View>
        <List.Section>
          <List.Subheader>Thông tin cá nhân:</List.Subheader>
          <List.Item title={`Tên: ${person.username}`} />
          <List.Item
            title={`Ngày sinh: ${moment(new Date(person.dob)).format('L')}`}
          />
          <List.Item title={`Địa chỉ: ${person.address}`} />
          <List.Item title={`Giới Tính: ${person.gender ? 'Nam' : 'Nữ'} `} />
          <List.Item title={`Nhóm máu: ${blood}`} />
          <List.Item
            title={`Tình trạng hiện tại: ${
              anamnesis === 1
                ? 'Bình Thường'
                : anamnesis === 2
                ? 'Tiểu đường típ 1'
                : 'Tiểu đường típ 2'
            }`}
          />
        </List.Section>
        <List.Section>
          <List.Subheader>Bác sĩ đảm nhận:</List.Subheader>
          {!doctor_blood_id && !doctor_glycemic_id && (
            <List.Item title={'Bạn chưa có bác sĩ nào đảm nhận'} />
          )}
        </List.Section>
        {doctor_blood_id && (
          <TouchableOpacity style={styles.doctor_info}>
            <Image
              source={{uri: doctor_blood_id.person.avatar}}
              style={styles.doctor_info_image}
            />
            <View style={styles.doctor_info_text}>
              <Text>{`Bác sĩ: ${doctor_blood_id.person.username}`}</Text>
              <Text>{`Chuyên điều trị: ${
                doctor_blood_id.work_type === 'glycemic'
                  ? 'Đường huyết'
                  : 'Huyết áp'
              }`}</Text>
              <Text>{`Đánh giá: ${doctor_blood_id.rating}/5`}</Text>
            </View>
          </TouchableOpacity>
        )}

        {doctor_glycemic_id && (
          <TouchableOpacity
            style={styles.doctor_info}
            onPress={handleViewDoctorInfo}>
            <Image
              source={{uri: doctor_glycemic_id.person.avatar}}
              style={styles.doctor_info_image}
            />
            <View style={styles.doctor_info_text}>
              <Text>{`Bác sĩ: ${doctor_glycemic_id.person.username}`}</Text>
              <Text>{`Chuyên điều trị: ${
                doctor_glycemic_id.work_type === 'glycemic'
                  ? 'Đường huyết'
                  : 'Huyết áp'
              }`}</Text>
              <Text>{`Đánh giá: ${doctor_glycemic_id.rating}/5`}</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal_container}
          style={{display: 'flex', alignItems: 'center'}}>
          <Text style={styles.modal_title}>Thay đổi thông tin cá nhân</Text>
          <TouchableOpacity onPress={handleChooseImage}>
            <Image
              source={{uri: image?.uri ?? person.avatar}}
              style={styles.modal_image}
            />
          </TouchableOpacity>
          <TextInputPrimary
            isName={true}
            placeholder="Họ và tên"
            value={name}
            editable
            selectTextOnFocus={false}
            onChangeText={val => setName(val)}
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
            value={_blood}
            _setValue={setBlood}
            items={bloodITems}
            isBlood
          />
          <Button
            mode="contained"
            style={{zIndex: -1}}
            onPress={handleUpdateIn4}>
            Xác nhận
          </Button>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 24,
    width: '100%',
    height: 64,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header_image: {
    width: 64,
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 50,
    marginLeft: 16,
  },
  doctor_info: {
    backgroundColor: '#a2d2ff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 8,
    borderRadius: 16,
    marginTop: 4,
  },
  doctor_info_image: {
    width: 64,
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  doctor_info_text: {
    marginLeft: 8,
  },
  modal_container: {
    backgroundColor: '#fff',
    width: '95%',
    height: 600,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 16,
  },
  modal_title: {
    fontSize: 16,
    fontWeight: '600',
  },
  modal_image: {
    width: 64,
    height: 64,
    backgroundColor: '#ccc',
    borderRadius: 50,
    marginLeft: 16,
    marginVertical: 8,
  },
});
export default ProfilePatientScreen;
