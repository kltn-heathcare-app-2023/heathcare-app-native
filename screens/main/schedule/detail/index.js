import moment from 'moment';
import {Alert, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {Button, List} from 'react-native-paper';
import {registerSchedule} from '../../../../services/patient/schedule_detail';

import 'moment/locale/vi'; // without this line it didn't work
import {useState} from 'react';
import RouterKey from '../../../../utils/Routerkey';
import {useDispatch} from 'react-redux';
import {scheduleDetailSlice} from '../../../../redux/slices/scheduleDetailSlice';
import {socket} from '../../../../utils/config';
import {Popup} from 'popup-ui';
moment.locale('vi');

import {Button as ButtonRE} from 'react-native-elements';

function DetailScheduleRegister({navigation, route}) {
  const {schedule, dateSelected} = route.params;
  const {doctor, time, fee} = schedule;
  const [text, setText] = useState();
  const [loading, setLoading] = useState(false);
  // console.log('schedule in detail -> ', schedule);
  // console.log('time in detail -> ', time);
  // console.log('dateSelected-> ', dateSelected);
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
        setLoading(true);
        const resp = await registerSchedule({
          content_exam: text,
          schedule: schedule._id,
          day_exam: scheduleDateStart,
        });

        const {notification, conversation, schedule_detail} = resp.data;
        if (notification && schedule_detail) {
          socket.emit('notification_register_schedule_from_patient', {
            data: {notification, schedule_detail},
          });
        }
        if (schedule_detail) {
          setText('');
          setLoading(false);
          Popup.show({
            type: 'Success',
            title: 'Thông báo',
            button: true,
            textBody: 'Đăng ký ca khám thành công',
            buttontext: 'Nhập ngay',
            callback: () => {
              // navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
              //   screen: RouterKey.INFO_SCREEN,
              // });
              Popup.hide();
            },
          });
          dispatch(
            scheduleDetailSlice.actions.pushScheduleDetail(schedule_detail),
          );
          navigation.goBack();
          navigation.navigate(RouterKey.HOME_SCREEN);
        }
      } catch (error) {
        setLoading(false);
        Popup.show({
          type: 'Danger',
          title: 'Thông báo',
          button: true,
          textBody: error.message,
          buttontext: 'Nhập ngay',
          callback: () => {
            navigation.navigate(RouterKey.SCHEDULE_LIST_SCREEN);
            Popup.hide();
          },
        });
      }
    } else {
      Popup.show({
        type: 'Warning',
        title: 'Thông báo',
        button: true,
        textBody:
          'Vui lòng nhập nội dung để bác sĩ dễ dàng chuẩn bị để chuẩn đoán',
        buttontext: 'Nhập ngay',
        callback: () => {
          // navigation.navigate(RouterKey.SCHEDULE_LIST_SCREEN);
          Popup.hide();
        },
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>Lịch khám</List.Subheader>
        <List.Item
          style={styles.list}
          title={`Bắt đầu: ${moment(new Date(scheduleDateStart)).format(
            'llll',
          )}`}
          left={() => <List.Icon icon="timetable" />}
          titleStyle={{fontWeight: '700'}}
        />
        <List.Item
          style={styles.list}
          title={`Kết thúc: ${moment(new Date(scheduleDateEnd)).format(
            'llll',
          )}`}
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
          // backgroundColor: '#ffff',
          marginHorizontal: 16,
          // borderRadius: 16,
          padding: 8,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#BAD7E9',
        }}
        placeholder={'Lý do muốn khám hoặc một số triệu chứng'}
      />

      {/* <Button
        icon="tray-plus"
        mode="contained-tonal"
        onPress={handleRegisterSchedule}
        style={{backgroundColor: '#BAD7E9', margin: 16}}>
        Đăng ký khám
      </Button> */}

      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}>
        <ButtonRE
          title={'Đăng ký khám'}
          onPress={handleRegisterSchedule}
          buttonStyle={styles.modal_button}
          loading={loading}
          icon={{
            name: 'calendar',
            type: 'font-awesome',
            size: 15,
            color: 'white',
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    paddingBottom: 16,
  },
  list: {
    marginLeft: 16,
  },

  modal_button: {
    marginTop: 12,
    borderRadius: 8,
    width: 350,
  },
});
export default DetailScheduleRegister;
