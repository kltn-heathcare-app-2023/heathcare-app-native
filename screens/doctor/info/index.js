import {View} from 'react-native';
import {Button} from 'react-native-paper';
import {doctorInfoSlice} from '../../../redux/slices/doctor/doctorInfoSlice';
import RouterKey from '../../../utils/Routerkey';
import storage from '../../../utils/storage';

function DoctorInfoScreen({navigation}) {
  const handleLogoutByDoctor = async () => {
    navigation.navigate(RouterKey.LOGIN_SCREEN);
    await storage.remove('accessToken');
    dispatch(doctorInfoSlice.actions.resetDoctorProfile());
  };
  return (
    <View>
      <Button onPress={handleLogoutByDoctor}>Đăng xuất</Button>
    </View>
  );
}

export default DoctorInfoScreen;
