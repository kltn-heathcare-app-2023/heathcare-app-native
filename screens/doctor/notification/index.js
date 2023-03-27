import {Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import RouterKey from '../../../utils/Routerkey';
import storage from '../../../utils/storage';
function DoctorNotificationScreen({navigation}) {
  const handleLogoutByDoctor = async () => {
    await storage.remove('accessToken');
    navigation.navigate(RouterKey.LOGIN_SCREEN);
  };
  return (
    <View>
      <Text>This is page notification</Text>
      <Button onPress={handleLogoutByDoctor}>Đăng xuất</Button>
    </View>
  );
}

export default DoctorNotificationScreen;
