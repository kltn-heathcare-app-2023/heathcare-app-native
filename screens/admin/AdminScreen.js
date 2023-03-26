import {Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import RouterKey from '../../utils/Routerkey';
import storage from '../../utils/storage';

function AdminScreen({navigation}) {
  const handleLogoutByAdmin = async () => {
    await storage.remove('accessToken');
    navigation.navigate(RouterKey.LOGIN_SCREEN);
  };

  return (
    <View>
      <Text>This is page admin</Text>
      <Button onPress={handleLogoutByAdmin}>Đăng xuât</Button>
    </View>
  );
}

export default AdminScreen;
