import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import RouterKey from '../../utils/Routerkey';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DoctorHomeScreen from '../../screens/doctor/home';
import DoctorConversationScreen from '../../screens/doctor/conversation';
import DoctorNotificationScreen from '../../screens/doctor/notification';

const Tab = createBottomTabNavigator();

const screenOptions = ({route}) => ({
  tabBarIcon: ({color}) => {
    let iconName;
    if (route.name === RouterKey.DOCTOR_CONVERSATION_SCREEN) {
      iconName = 'message-processing';
    } else if (route.name === RouterKey.DOCTOR_HOME_SCREEN) {
      iconName = 'book-account';
    } else if (route.name === RouterKey.DOCTOR_NOTIFICATION_SCREEN) {
      iconName = 'account';
    }
    return <Icon name={iconName} size={20} color={color} />;
  },
  tabBarInactiveTintColor: '#ccc',
  tabBarActiveTintColor: '#219ebc',
  headerTitleAlign: 'center',
});

function AdminNavigator() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={RouterKey.DOCTOR_HOME_SCREEN}
        component={DoctorHomeScreen}
        options={{tabBarLabel: 'Trang chủ', title: 'Trang chủ'}}
      />
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
        }}
      />
      {/* <Tab.Screen
        name={RouterKey.ROUTER_INFO_SCREEN}
        component={MainInfo}
        options={{
          tabBarLabel: 'Cá nhân',
          title: 'Cá nhân',
        }}
      /> */}
    </Tab.Navigator>
  );
}

export default AdminNavigator;
