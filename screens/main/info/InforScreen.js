import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {COLOR_1, COLOR_2, COLOR_3, COLOR_4} from '../../../common/constant';
import {
  infoSelector,
  notificationByBMIMertric,
  userAVGBMISelector,
  userLastGlycemicSelector,
} from '../../../redux/selectors/infoSelector';
import {infoSlice} from '../../../redux/slices/infoSlice';
import RouterKey from '../../../utils/Routerkey';
import storage from '../../../utils/storage';

const getBackgroundByGenderAndBMI = (avg_bmi, gender) => {
  switch (gender) {
    case true:
      {
        if (avg_bmi < 20) return COLOR_1;
        else if (avg_bmi < 26) return COLOR_2;
        else if (avg_bmi < 30) return COLOR_3;
        else return COLOR_4;
      }
      break;
    case false:
      {
        if (avg_bmi < 18) return COLOR_1;
        else if (avg_bmi < 24) return COLOR_2;
        else if (avg_bmi < 31) return COLOR_3;
        else return COLOR_4;
      }
      break;
  }
};

function InfoScreen({navigation}) {
  const user_info = useSelector(infoSelector);
  const bmi_avg = useSelector(userAVGBMISelector);
  const glycemic = useSelector(userLastGlycemicSelector);
  const notification = useSelector(notificationByBMIMertric);

  const {person, blood} = user_info;

  const dispatch = useDispatch();

  const handleClickBoxBMI = () => {
    navigation.navigate(RouterKey.INFO_BMI_SCREEN);
  };

  const handleLogout = () => {
    dispatch(infoSlice.actions.resetUserInfo());
    storage.remove('accessToken');

    navigation.navigate(RouterKey.LOGIN_SCREEN);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header_info}>
        <Image style={styles.header_info_img} source={{uri: person.avatar}} />

        <View style={styles.header_info_text}>
          <Text>{`Họ & tên: ${person.username}`}</Text>
          <Text>{`Năm sinh : ${person.dob}`}</Text>
          <Text>{`Địa chỉ : ${person.address.slice(0, 22)} ...`}</Text>
          <Text>{`Giới tính : ${person.gender ? 'Nam' : 'Nu'}`}</Text>
          <Text>{`Nhóm máu : ${blood}`}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.bmi_container,
          {
            backgroundColor: getBackgroundByGenderAndBMI(
              bmi_avg,
              person.gender,
            ),
          },
        ]}
        onPress={handleClickBoxBMI}>
        <View style={styles.bmi_text}>
          <Text style={styles.bmi_text_title}>
            {`Chỉ số BMI Trung Bình: ${bmi_avg}`}
          </Text>
          <Text style={styles.bmi_text_notification}>
            {notification || `Bạn cần ăn uống điều độ hơn và chú ý sức khỏe`}
          </Text>
        </View>
        <Image
          style={styles.header_info_img}
          source={require('../../../assets/images/bmi.png')}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.bmi_container}>
        <Image
          style={styles.header_info_img}
          source={require('../../../assets/images/glycemic.png')}
        />
        <View style={styles.bmi_text}>
          <Text style={styles.bmi_text_title}>
            {`Chỉ số Đường Huyết mới nhất: ${glycemic}`}
          </Text>
          <Text
            style={
              styles.bmi_text_notification
            }>{`Bạn cần ăn uống điều độ hơn và chú ý sức khỏe`}</Text>
        </View>
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
