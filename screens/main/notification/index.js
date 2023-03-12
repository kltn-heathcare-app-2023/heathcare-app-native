import moment from 'moment';
import {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {ScrollView} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {type} from '../../../common/constant';
import {infoSelector} from '../../../redux/selectors/infoSelector';
import {
  notificationSlice,
  fetchNotificationListById,
  notification_list_filter,
  notification_list_selector,
  updateStatusSeenNotification,
} from '../../../redux/slices/notificationSlice';

const type_items = [
  {label: 'Tất cả', value: type.RULE_ALL},
  {label: 'Nhắc nhở', value: type.RULE_DOCTOR_REMIND},
  {label: 'Lịch khám', value: type.RULE__SCHEDULE},
  {label: 'Đã xem', value: type.RULE_HAS_SEEN},
];

function NotificationScreen() {
  const dispatch = useDispatch();
  const [choose, setChoose] = useState(type.RULE_ALL);
  const [open, setOpen] = useState(false);
  const user_info = useSelector(infoSelector);
  const notification_list = useSelector(notification_list_filter);

  useEffect(() => {
    dispatch(fetchNotificationListById(user_info._id));
  }, []);

  useEffect(() => {
    dispatch(notificationSlice.actions.updateNotificationType(choose));
  }, [choose]);

  const handleSeenNotification = async () => {
    const ids = notification_list.map(notification => notification._id);
    dispatch(updateStatusSeenNotification(ids));
  };

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        setOpen={setOpen}
        value={choose}
        setValue={setChoose}
        items={type_items}
        placeholder={'Tất cả'}
        style={{
          marginVertical: 16,
          marginLeft: 4,
          width: '50%',
        }}
        dropDownContainerStyle={{
          width: '50%',
          zIndex: 1,
          marginTop: 16,
          marginLeft: 4,
        }}
      />
      <ScrollView style={styles.container_scroll_view}>
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
                    : '#f6bd60',
                },
              ]}
              key={_id}>
              <Text style={styles.header_notification}>
                {rule.includes('SCHEDULE') ? 'Lịch khám' : 'Nhắc nhở'}
              </Text>
              <Text style={styles.content_notification}>{content}</Text>
              <Text style={styles.time_notification}>
                {moment(createdAt).fromNow()} - {hasSeen ? 'Đã xem' : null}
              </Text>
            </TouchableOpacity>
          );
        })}
        {notification_list.length > 0 && choose !== type.RULE_HAS_SEEN ? (
          <Button
            onPress={handleSeenNotification}
            style={{marginBottom: 8}}
            mode="elevated">
            Đánh dấu đã xem
          </Button>
        ) : choose === type.RULE_HAS_SEEN ? null : (
          <Text style={{textAlign: 'center', fontSize: 16}}>
            Bạn chưa có thông báo nào
          </Text>
        )}
      </ScrollView>
    </View>
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
export default NotificationScreen;
