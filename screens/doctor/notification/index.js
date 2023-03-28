import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button} from 'react-native-paper';
import RouterKey from '../../../utils/Routerkey';
import storage from '../../../utils/storage';
import {useNotification} from 'react-native-internal-notification';
import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchNotificationListById,
  notification_list_selector,
} from '../../../redux/slices/notificationSlice';
import {doctorProfileSelector} from '../../../redux/selectors/doctor/infoSelector';
import {ScrollView} from 'react-native-gesture-handler';
import {type} from '../../../common/constant';
import moment from 'moment';

function DoctorNotificationScreen({navigation}) {
  const dispatch = useDispatch();
  const doctor_profile = useSelector(doctorProfileSelector);
  const notification_list = useSelector(notification_list_selector);

  const handleLogoutByDoctor = async () => {
    await storage.remove('accessToken');
    navigation.navigate(RouterKey.LOGIN_SCREEN);
  };

  const notification = useNotification();

  useEffect(() => {
    // notification.showNotification({
    //   title: 'My first notification',
    //   message: 'Hello from my first message',
    //   icon: null,
    //   onPress: () => {
    //     alert('Pressed');
    //   },
    // });
    dispatch(fetchNotificationListById(doctor_profile.doctor._id));
  }, []);

  return (
    <ScrollView>
      <Button onPress={handleLogoutByDoctor}>Đăng xuất</Button>
      {notification_list.map(({_id, content, createdAt, rule, hasSeen}) => {
        return (
          <TouchableOpacity
            style={[
              styles.container_notification,
              {
                backgroundColor: rule.includes(
                  type.RULE_NOTIFICATION_REGISTER_SCHEDULE,
                )
                  ? '#a8dadc'
                  : rule.includes(type.RULE_NOTIFICATION_CANCEL_SCHEDULE)
                  ? '#fec89a'
                  : rule === type.RULE_SYSTEM
                  ? '#ccc'
                  : '#f6bd60',
              },
            ]}
            key={_id}>
            <Text style={styles.header_notification}>
              {rule.includes('SCHEDULE')
                ? 'Lịch khám'
                : rule.includes('REMIND')
                ? 'Nhắc nhở'
                : 'Hệ thống'}
            </Text>
            <Text style={styles.content_notification}>{content}</Text>
            <Text style={styles.time_notification}>
              {moment(createdAt).fromNow()} - {hasSeen ? 'Đã xem' : null}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_scroll_view: {
    zIndex: -1,
  },
  container_notification: {
    marginBottom: 8,
    marginHorizontal: 4,
    padding: 8,
    borderRadius: 8,
  },
  header_notification: {
    fontSize: 16,
    fontWeight: '700',
  },
  content_notification: {
    fontSize: 14,
    fontWeight: '500',
  },
  time_notification: {
    marginTop: 4,
    textAlign: 'right',
  },
});

export default DoctorNotificationScreen;
