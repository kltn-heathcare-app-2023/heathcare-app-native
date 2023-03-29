import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import RouterKey from '../utils/Routerkey';
import HomeScreen from '../screens/main/home';
import MessageScreen from '../screens/main/messages';
import MainInfo from '../screens/main/info';
import MainScheduleScreen from '../screens/main/schedule';
import NotificationScreen from '../screens/main/notification';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {notification_list_unread_filter} from '../redux/slices/notificationSlice';
import {useSelector} from 'react-redux';

const Tab = createBottomTabNavigator();

const screenOptions = ({route}) => ({
  tabBarIcon: ({color}) => {
    let iconName;
    if (route.name === RouterKey.MESSAGE_SCREEN) {
      iconName = 'message-processing';
    } else if (route.name === RouterKey.HOME_SCREEN) {
      iconName = 'book-account';
    } else if (route.name === RouterKey.ROUTER_INFO_SCREEN) {
      iconName = 'account';
    } else if (route.name === RouterKey.SCHEDULE_ROUTER_SCREEN) {
      iconName = 'webpack';
    } else if (route.name === RouterKey.NOTIFICATION_SCREEN) {
      iconName = 'bell-ring-outline';
    }
    return <Icon name={iconName} size={20} color={color} />;
  },
  tabBarInactiveTintColor: '#ccc',
  tabBarActiveTintColor: '#219ebc',
  headerTitleAlign: 'center',
});

function MainNavigator() {
  const notification_unread = useSelector(notification_list_unread_filter);

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={RouterKey.HOME_SCREEN}
        component={HomeScreen}
        options={{tabBarLabel: 'Trang chủ', title: 'Trang chủ'}}
      />
      <Tab.Screen
        name={RouterKey.SCHEDULE_ROUTER_SCREEN}
        component={MainScheduleScreen}
        options={{tabBarLabel: 'Lịch khám', title: 'Lịch khám'}}
      />
      <Tab.Screen
        name={RouterKey.MESSAGE_SCREEN}
        component={MessageScreen}
        options={{tabBarLabel: 'Tin nhắn', title: 'Tin nhắn'}}
      />
      <Tab.Screen
        name={RouterKey.NOTIFICATION_SCREEN}
        component={NotificationScreen}
        options={{
          tabBarLabel: 'Thông báo',
          title: 'Thông báo',
          tabBarBadge: notification_unread > 0 ? notification_unread : null,
        }}
      />
      <Tab.Screen
        name={RouterKey.ROUTER_INFO_SCREEN}
        component={MainInfo}
        options={{
          tabBarLabel: 'Cá nhân',
          title: 'Cá nhân',
        }}
      />
    </Tab.Navigator>
  );
}

export default MainNavigator;
