import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RouterKey from '../../utils/Routerkey';
import InfoScreen from '../../screens/main/info/InforScreen';
import BMIScreen from '../../screens/main/info/BMIScreen';
import GlycemicScreen from '../../screens/main/info/GlycemicScreen';
import BloodScreen from '../../screens/main/info/BloodScreen';
import ProfilePatientScreen from '../../screens/main/info/ProfileScreen';
import PatientViewInfoDoctorScreen from '../../screens/main/info/doctorProfileScreen';
import HistoryScreen from '../../screens/main/info/HistoryScheduleScreen';

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
      <Stack.Screen
        name={RouterKey.PROFILE_PATIENT_SCREEN}
        component={ProfilePatientScreen}
      />
      <Stack.Screen
        name={RouterKey.PATIENT_INFO_DOCTOR_SCREEN}
        component={PatientViewInfoDoctorScreen}
      />
      <Stack.Screen
        name={RouterKey.PATIENT_HISTORY_SCREEN}
        component={HistoryScreen}
      />
    </Stack.Navigator>
  );
}

export default InfoNavigator;
