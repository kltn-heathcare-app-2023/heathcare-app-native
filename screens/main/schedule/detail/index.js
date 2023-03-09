import moment from 'moment';
import {Alert, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {Button, List} from 'react-native-paper';
import {registerSchedule} from '../../../../services/patient/schedule_detail';

import 'moment/locale/vi'; // without this line it didn't work
import {useState} from 'react';
import RouterKey from '../../../../utils/Routerkey';
import {TITLE_NOTIFICATION} from '../../../../common/title';
import {useDispatch} from 'react-redux';
import {scheduleDetailSlice} from '../../../../redux/slices/scheduleDetailSlice';
import {socket} from '../../../../utils/config';

moment.locale('vi');

function DetailScheduleRegister({navigation, route}) {
  const {schedule, dateSelected} = route.params;
  const {doctor, time, fee} = schedule;
  const [text, setText] = useState();

  const dispatch = useDispatch();

  const timeStart = new Date(time.time_start);
  const timeEnd = new Date(time.time_end);

  const scheduleDateStart = new Date();
  scheduleDateStart.setTime(timeStart.getTime());
  scheduleDateStart.setDate(new Date(dateSelected).getDate());
  scheduleDateStart.setMonth(new Date(dateSelected).getMonth());

  const scheduleDateEnd = new Date();
  scheduleDateEnd.setTime(timeEnd.getTime());
  scheduleDateEnd.setDate(new Date(dateSelected).getDate());
  scheduleDateEnd.setMonth(new Date(dateSelected).getMonth());

  const handleRegisterSchedule = async () => {
    if (text && scheduleDateStart && schedule._id) {
      try {
        const resp = await registerSchedule({
          content_exam: text,
          schedule: schedule._id,
          day_exam: scheduleDateStart,
        });

        const {notification, conversation, schedule_detail} = resp.data;
        if (notification) {
          socket.emit('notification_register_schedule_from_patient', {
            data: notification,
          });
        }
        if (schedule_detail) {
          setText('');
          Alert.alert(TITLE_NOTIFICATION, 'Đăng ký ca khám thành công');
          dispatch(
            scheduleDetailSlice.actions.pushScheduleDetail(schedule_detail),
          );
          navigation.goBack();
          navigation.navigate(RouterKey.HOME_SCREEN);
        }
      } catch (error) {
        Alert.alert(TITLE_NOTIFICATION, error.message);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>Lịch khám</List.Subheader>
        <List.Item
          style={styles.list}
          title={`Bắt đầu: ${moment(scheduleDateStart).format('llll')}`}
          left={() => <List.Icon icon="timetable" />}
          titleStyle={{fontWeight: '700'}}
        />
        <List.Item
          style={styles.list}
          title={`Kết thúc: ${moment(scheduleDateEnd).format('llll')}`}
          left={() => <List.Icon icon="clock-time-ten-outline" />}
          titleStyle={{fontWeight: '700'}}
        />
        <List.Item
          style={styles.list}
          title={`Chi phí: ${schedule.fee.toLocaleString('vi', {
            style: 'currency',
            currency: 'VND',
          })}`}
          left={() => <List.Icon icon="react" />}
          titleStyle={{fontWeight: '700'}}
        />
      </List.Section>

      <TextInput
        value={text}
        onChangeText={val => setText(val)}
        multiline={true}
        numberOfLines={8}
        style={{
          height: 160,
          textAlignVertical: 'top',
          backgroundColor: '#ffff',
          marginHorizontal: 16,
          // borderRadius: 16,
          padding: 8,
        }}
        placeholder={'Lý do muốn khám hoặc một số triệu chứng'}
      />

      <Button
        icon="tray-plus"
        mode="contained-tonal"
        onPress={handleRegisterSchedule}
        style={{backgroundColor: '#FFFF', margin: 16}}>
        Đăng ký khám
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#BAD7E9',
    paddingBottom: 16,
  },
  list: {
    marginLeft: 16,
  },
});
export default DetailScheduleRegister;
