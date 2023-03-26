import {Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text} from 'react-native';
import {Button, List} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {infoSelector} from '../../../redux/selectors/infoSelector';
import RouterKey from '../../../utils/Routerkey';
import Lottie from 'lottie-react-native';

function ProfilePatientScreen({navigation}) {
  const user_info = useSelector(infoSelector);
  const {person, blood, anamnesis, doctor_blood_id, doctor_glycemic_id} =
    user_info;

  const handleViewDoctorInfo = () => {
    console.log('click ', doctor_glycemic_id);
    navigation.navigate(RouterKey.SCHEDULE_ROUTER_SCREEN, {
      screen: RouterKey.SCHEDULE_DETAIL_SCREEN,
      params: {schedule: {doctor: doctor_glycemic_id}},
    });
  };

  const handleOpenModal = () => {
    console.log('click ');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{uri: person.avatar}} style={styles.header_image} />
        <TouchableOpacity
          onPress={() => {
            console.log('clicked');
          }}>
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
        <List.Item title={`Ngày sinh: ${person.dob}`} />
        <List.Item title={`Địa chỉ: ${person.address}`} />
        <List.Item title={`Giới Tính: ${person.gender ? 'Nam' : 'Nữ'} `} />
        <List.Item title={`Nhóm máu: ${blood}`} />
        <List.Item
          title={`Tiền sử bệnh: ${
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
});
export default ProfilePatientScreen;
