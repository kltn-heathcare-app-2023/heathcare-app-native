import {StyleSheet} from 'react-native';
import {Image, View} from 'react-native';

import Lottie from 'lottie-react-native';
import {useEffect} from 'react';
import storage from '../../utils/storage';
import RouterKey from '../../utils/Routerkey';

function LoadingScreen({navigation}) {
  const init = async () => {
    const token = await storage.get('accessToken');
    console.log(token);
    if (token) {
      navigation.navigate(RouterKey.MAIN_SCREEN);
    } else {
      navigation.navigate(RouterKey.LOGIN_SCREEN);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <View style={styles.container}>
      <Lottie
        source={require('../../assets/images/splash.json')}
        autoPlay
        loop
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
});

export default LoadingScreen;
