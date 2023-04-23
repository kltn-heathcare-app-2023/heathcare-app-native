import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {
  notification_list_selector,
  updateStatusSeenNotification,
  notification_list_unread_filter,
} from '../../../redux/slices/notificationSlice';
import {ScrollView} from 'react-native-gesture-handler';
import {type} from '../../../common/constant';
import moment from 'moment';
import Header from '../../../components/Header';
import {useState} from 'react';
function DoctorNotificationScreen({navigation}) {
  const dispatch = useDispatch();
  const notification_list = useSelector(notification_list_selector);
  const notification_list_unread = useSelector(notification_list_unread_filter);
  const [size, setSize] = useState(10);

  const handleSeenNotification = async () => {
    const ids = notification_list.map(notification => notification._id);
    dispatch(updateStatusSeenNotification(ids));
  };

  const handleLoadMoreNotification = () => {
    if (size < notification_list.length) {
      setSize(prev => prev + 10);
    }
  };

  return (
    <>
      {/* <Header title={'Thông báo'} handle={() => navigation.goBack()} /> */}
      <ScrollView>
        {notification_list_unread > 0 && (
          <Button
            onPress={handleSeenNotification}
            style={{marginBottom: 8}}
            mode="elevated">
            Đánh dấu đã xem
          </Button>
        )}
        {notification_list
          .slice(0, size)
          .map(({_id, content, createdAt, rule, hasSeen}) => {
            return (
              <TouchableOpacity
                style={[
                  styles.container_notification,
                  {
                    backgroundColor: rule.includes(
                      type.RULE_NOTIFICATION_REGISTER_SCHEDULE,
                    )
                      ? '#a8dadc'
                      : rule === type.RULE_NOTIFICATION_CANCEL_SCHEDULE
                      ? '#fec89a'
                      : rule === type.RULE_SYSTEM
                      ? '#ccc'
                      : rule === type.RULE_WARNING
                      ? '#fca311'
                      : rule === type.RULE_SOS
                      ? '#e63946'
                      : '#f6bd60',
                  },
                ]}
                key={_id}>
                <Text style={styles.header_notification}>
                  {rule.includes('SCHEDULE')
                    ? 'Lịch khám'
                    : rule.includes('REMIND')
                    ? 'Nhắc nhở'
                    : rule === type.RULE_WARNING
                    ? 'Cảnh báo'
                    : rule === type.RULE_SOS
                    ? 'SOS'
                    : 'Hệ thống'}
                </Text>
                <Text style={styles.content_notification}>{content}</Text>
                <Text style={styles.time_notification}>
                  {moment(createdAt).fromNow()} - {hasSeen ? 'Đã xem' : null}
                </Text>
              </TouchableOpacity>
            );
          })}
        {size < notification_list.length && (
          <Button
            onPress={handleLoadMoreNotification}
            style={{marginBottom: 8}}
            mode="elevated">
            Tải thêm
          </Button>
        )}
      </ScrollView>
    </>
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
