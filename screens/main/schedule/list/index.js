import {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import CalendarStrip from 'react-native-slideable-calendar-strip';
import {useDispatch, useSelector} from 'react-redux';
import {TITLE_NOTIFICATION} from '../../../../common/title';
import ScheduleItem from '../../../../components/ScheduleItem';
import {
  filterScheduleByDayOfWeek,
  filterScheduleByDoctorName,
} from '../../../../redux/selectors/scheduleSelector';
import {
  scheduleSlice,
  fetchAllScheduleDoctor,
  updateDoctorName,
} from '../../../../redux/slices/scheduleSlice';

function ScheduleListScreen({navigation}) {
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState();
  const [doctorName, setDoctorName] = useState('');
  const schedule_list = useSelector(filterScheduleByDayOfWeek);
  const schedule_list_by_doctor = useSelector(filterScheduleByDoctorName);
  useEffect(() => {
    if (schedule_list.length === 0) {
      dispatch(fetchAllScheduleDoctor());
    }
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <CalendarStrip
        showWeekNumber
        selectedDate={selectedDate ? selectedDate : new Date()}
        onPressDate={date => {
          if (
            date.getMonth() === new Date().getMonth() &&
            date.getDate() < new Date().getDate()
          ) {
            Alert.alert(
              TITLE_NOTIFICATION,
              'Vui lòng chọn ngày lớn hơn hoặc bằng ngày hôm nay',
            );
          } else {
            dispatch(scheduleSlice.actions.chooseDayOfWeek(date));
            setSelectedDate(date);
          }
        }}
        onPressGoToday={today => {
          setSelectedDate(today);
          dispatch(scheduleSlice.actions.chooseDayOfWeek(today));
        }}
        onSwipeDown={() => {
          alert('onSwipeDown');
        }}
        markedDate={['2023-02-25', '2023-05-15', '2023-06-04', '2023-05-01']}
        weekStartsOn={1} // 0,1,2,3,4,5,6 for S M T W T F S, defaults to 0
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập tên bác sĩ"
        onChangeText={value => {
          // console.log(value);
          setDoctorName(value);
          dispatch(updateDoctorName(value));
        }}
        value={doctorName}
      />
      <ScrollView style={styles.schedule_list}>
        {schedule_list_by_doctor && schedule_list_by_doctor.length > 0 ? (
          schedule_list_by_doctor.map(schedule => {
            return (
              <ScheduleItem
                schedule={schedule}
                navigation={navigation}
                key={schedule._id}
                dateSelected={selectedDate}
              />
            );
          })
        ) : (
          <View
            style={{
              flex: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 300,
            }}>
            <Text>Hôm nay đã hết lịch trống vui lòng chọn ngày khác!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  schedule_list: {
    marginTop: 8,
    height: '80%',
    width: '100%',
  },
  input: {
    width: '96%',
    borderWidth: 1,
    borderColor: '#219ebc',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    marginLeft: 24,
    marginRight: 24,
  },
});

export default ScheduleListScreen;
