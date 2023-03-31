import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import RouterKey from '../../utils/Routerkey';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DoctorHomeScreen from '../../screens/doctor/home';
import DoctorConversationScreen from '../../screens/doctor/conversation';
import DoctorNotificationScreen from '../../screens/doctor/notification';
import PatientInfo from '../../screens/doctor/home/PatientInfo';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DoctorHomeListPatientExamScreen from '../../screens/doctor/home/ListPatientExam';
import DoctorConversationList from '../../screens/doctor/conversation/conversations';
import DoctorConversationDetail from '../../screens/doctor/conversation/messages';
import {useSelector} from 'react-redux';
import {notification_list_unread_filter} from '../../redux/slices/notificationSlice';
import DoctorInfoScreen from '../../screens/doctor/info';

const Tab = createBottomTabNavigator();

const screenOptions = ({route}) => ({
  tabBarIcon: ({color}) => {
    let iconName;
    if (route.name === RouterKey.DOCTOR_CONVERSATION_SCREEN) {
      iconName = 'message-processing';
    } else if (route.name === RouterKey.DOCTOR_HOME_SCREEN) {
      iconName = 'book-account';
    } else if (route.name === RouterKey.DOCTOR_NOTIFICATION_SCREEN) {
      iconName = 'bell-ring-outline';
    } else if (route.name === RouterKey.DOCTOR_INFO_SCREEN) {
      iconName = 'account';
    }
    return <Icon name={iconName} size={20} color={color} />;
  },
  tabBarInactiveTintColor: '#ccc',
  tabBarActiveTintColor: '#219ebc',
  headerTitleAlign: 'center',
});

const Stack = createNativeStackNavigator();

export function DoctorHomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={RouterKey.DOCTOR_HOME_LIST_EXAM_SCREEN}>
      <Stack.Screen
        name={RouterKey.DOCTOR_HOME_LIST_EXAM_SCREEN}
        component={DoctorHomeListPatientExamScreen}
      />
      <Stack.Screen
        name={RouterKey.DOCTOR_HOME_PATIENT_INFO_SCREEN}
        component={PatientInfo}
      />
    </Stack.Navigator>
  );
}

export function DoctorConversationStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={RouterKey.DOCTOR_CONVERSATION_LIST_SCREEN}>
      <Stack.Screen
        name={RouterKey.DOCTOR_CONVERSATION_LIST_SCREEN}
        component={DoctorConversationList}
      />
      <Stack.Screen
        name={RouterKey.DOCTOR_CONVERSATION_DETAIL_SCREEN}
        component={DoctorConversationDetail}
      />
    </Stack.Navigator>
  );
}

function AdminNavigator() {
  const notification_unread = useSelector(notification_list_unread_filter);

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={RouterKey.DOCTOR_HOME_SCREEN}
        component={DoctorHomeScreen}
        options={{tabBarLabel: 'Trang chủ', title: 'Trang chủ'}}></Tab.Screen>
      <Tab.Screen
        name={RouterKey.DOCTOR_CONVERSATION_SCREEN}
        component={DoctorConversationScreen}
        options={{tabBarLabel: 'Tin nhắn', title: 'Tin nhắn'}}
      />
      <Tab.Screen
        name={RouterKey.DOCTOR_NOTIFICATION_SCREEN}
        component={DoctorNotificationScreen}
        options={{
          tabBarLabel: 'Thông báo',
          title: 'Thông báo',
          tabBarBadge: notification_unread > 0 ? notification_unread : null,
        }}
      />
      <Tab.Screen
        name={RouterKey.DOCTOR_INFO_SCREEN}
        component={DoctorInfoScreen}
        options={{
          tabBarLabel: 'Cá nhân',
          title: 'Cá nhân',
        }}
      />
    </Tab.Navigator>
  );
}

export default AdminNavigator;
