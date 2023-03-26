import {Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import storage from '../../../utils/storage';

function DoctorHomeScreen({navigation}) {
  const handleLogoutByDoctor = async () => {
    await storage.remove('accessToken');
    navigation.navigate(RouterKey.LOGIN_SCREEN);
  };
  return (
    <View>
      <Text>This is page home Doctor</Text>
      <Button onPress={handleLogoutByDoctor}>Đăng xuất</Button>
    </View>
  );
}

export default DoctorHomeScreen;
