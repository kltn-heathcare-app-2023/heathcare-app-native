import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RouterKey from '../../utils/Routerkey';
import InfoScreen from '../../screens/main/info/InforScreen';
import BMIScreen from '../../screens/main/info/BMIScreen';
import GlycemicScreen from '../../screens/main/info/GlycemicScreen';
import BloodScreen from '../../screens/main/info/BloodScreen';
const Stack = createNativeStackNavigator();

function InfoNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={RouterKey.INFO_SCREEN}>
      <Stack.Screen name={RouterKey.INFO_SCREEN} component={InfoScreen} />
      <Stack.Screen name={RouterKey.INFO_BMI_SCREEN} component={BMIScreen} />
      <Stack.Screen
        name={RouterKey.GLYCEMIC_SCREEN}
        component={GlycemicScreen}
      />
      <Stack.Screen name={RouterKey.BLOOD_SCREEN} component={BloodScreen} />
    </Stack.Navigator>
  );
}

export default InfoNavigator;
