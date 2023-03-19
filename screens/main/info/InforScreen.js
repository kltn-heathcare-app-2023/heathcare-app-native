import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {COLOR_1, COLOR_2, COLOR_3, COLOR_4} from '../../../common/constant';
import {
  infoSelector,
  notificationByBMIMertric,
  notificationByGlycemicMetric,
  userAVGBMISelector,
  userLastBloodPressureSelector,
  userLastGlycemicSelector,
} from '../../../redux/selectors/infoSelector';
import {infoSlice} from '../../../redux/slices/infoSlice';
import RouterKey from '../../../utils/Routerkey';
import storage from '../../../utils/storage';
import Lottie from 'lottie-react-native';

// const getAnimationByGenderAndBMI = (avg_bmi, gender) => {
//   switch (gender) {
//     case true:
//       {
//         if (avg_bmi < 20) return require('../../../assets/images/bmi_1.json');
//         else if (avg_bmi < 26)
//           return require('../../../assets/images/bmi_2.json');
//         else if (avg_bmi < 30)
//           return require('../../../assets/images/bmi_3.json');
//         else return require('../../../assets/images/bmi_4.json');
//       }
//       break;
//     case false:
//       {
//         if (avg_bmi < 18) return require('../../../assets/images/bmi_1.json');
//         else if (avg_bmi < 24)
//           return require('../../../assets/images/bmi_2.json');
//         else if (avg_bmi < 31)
//           return require('../../../assets/images/bmi_3.json');
//         else return require('../../../assets/images/bmi_4.json');
//       }
//       break;
//   }
// };

function InfoScreen({navigation}) {
  const dispatch = useDispatch();
  const user_info = useSelector(infoSelector);
  const bmi_avg = useSelector(userAVGBMISelector);
  const glycemic_last = useSelector(userLastGlycemicSelector);
  const last_blood_pressure = useSelector(userLastBloodPressureSelector);
  const notification = useSelector(notificationByBMIMertric);
  const {person, blood} = user_info;

  const {
    diastole = null,
    systolic = null,
    createdAt = null,
  } = last_blood_pressure;
  const glycemic_case_1 =
    glycemic_last.find(item => item.case === 1)?.metric ?? 0;

  const glycemic_case_2 =
    glycemic_last.find(item => item.case === 2)?.metric ?? 0;
  const glycemic_case_3 =
    glycemic_last.find(item => item.case === 3)?.metric ?? 0;

  const handleClickBoxBMI = () => {
    navigation.navigate(RouterKey.INFO_BMI_SCREEN);
  };

  const handleClickBoxGlycemic = () => {
    navigation.navigate(RouterKey.GLYCEMIC_SCREEN);
  };

  const handleClickBoxBlood = () => {
    navigation.navigate(RouterKey.BLOOD_SCREEN);
  };
  const handleLogout = async () => {
    await storage.remove('accessToken');
    navigation.navigate(RouterKey.LOGIN_SCREEN);
    dispatch(infoSlice.actions.resetUserInfo());
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header_info}>
        <Image style={styles.header_info_img} source={{uri: person.avatar}} />

        <View style={styles.header_info_text}>
          <Text>{`Họ & tên: ${person.username}`}</Text>
          <Text>{`Năm sinh : ${person.dob}`}</Text>
          <Text>{`Địa chỉ : ${person.address.slice(0, 22)} ...`}</Text>
          <Text>{`Giới tính : ${person.gender ? 'Nam' : 'Nữ'}`}</Text>
          <Text>{`Nhóm máu : ${blood}`}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.bmi_container]}
        onPress={handleClickBoxBMI}>
        <View style={styles.bmi_text}>
          <Text style={styles.bmi_text_title}>
            {`Chỉ số BMI Trung Bình: ${bmi_avg}`}
          </Text>
          <Text style={styles.bmi_text_notification}>
            {notification ?? `Bạn cần ăn uống điều độ hơn và chú ý sức khỏe`}
          </Text>
        </View>
        <Image
          style={styles.header_info_img}
          source={require('../../../assets/images/bmi.png')}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bmi_container}
        onPress={handleClickBoxGlycemic}>
        <Lottie
          source={require('../../../assets/images/blood.json')}
          autoPlay
          loop
          style={{
            marginLeft: 135,
          }}
        />
        <View style={styles.bmi_text}>
          <Text style={styles.bmi_text_title}>
            {`Chỉ số Đường Huyết mới nhất:`}
          </Text>
          <Text style={styles.bmi_text_notification}>
            {`Đường huyết trước khi ăn: ${glycemic_case_1}/600\n`}
            {`Đường huyết trước sau ăn: ${glycemic_case_2}/600\n`}
            {`Đường huyết trước trước ngủ: ${glycemic_case_3}/600\n`}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bmi_container}
        onPress={handleClickBoxBlood}>
        <View style={styles.bmi_text}>
          <Text style={styles.bmi_text_title}>
            {`Chỉ số Huyết áp mới nhất:`}
          </Text>
          <Text style={styles.bmi_text_notification}>
            {`Tâm thu: ${systolic}\n`}
            {`Tâm trương: ${diastole}\n`}
          </Text>
        </View>

        <Lottie
          source={require('../../../assets/images/heart.json')}
          autoPlay
          loop
          style={{
            marginLeft: 135,
          }}
        />
      </TouchableOpacity>

      <Button
        mode="contained"
        icon={'logout'}
        contentStyle={{backgroundColor: '#dc2f02'}}
        style={{marginTop: 16}}
        onPress={handleLogout}>
        Đăng xuất
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  header_info: {
    width: '100%',
    height: 'auto',
    borderWidth: 2,
    borderColor: '#219ebc',
    borderRadius: 16,
    padding: 8,

    display: 'flex',
    flexDirection: 'row',
  },
  header_info_img: {
    width: 100,
    height: 'auto',
    minHeight: 80,
    borderRadius: 16,
  },
  header_info_text: {
    marginLeft: 24,
  },
  bmi_container: {
    width: '100%',
    height: 'auto',
    borderWidth: 2,
    borderColor: '#219ebc',
    borderRadius: 16,
    padding: 8,
    marginTop: 8,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bmi_text: {
    width: '75%',
    height: 'auto',
  },
  bmi_text_title: {
    fontSize: 16,
    fontWeight: '700',
  },
  bmi_text_notification: {
    fontSize: 12,
    textTransform: 'capitalize',
    marginTop: 8,
  },
});
export default InfoScreen;
