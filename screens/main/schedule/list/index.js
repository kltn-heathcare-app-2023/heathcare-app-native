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
  updateDoctorType,
} from '../../../../redux/slices/scheduleSlice';
import DropDownPicker from '../../../../components/Input/DropdownPicker';

const optionTypes = [
  {label: 'Tất cả', value: ''},
  {label: 'Đường huyết', value: 'glycemic'},
  {label: 'Huyết áp', value: 'blood'},
];

function ScheduleListScreen({navigation}) {
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState();
  const [doctorName, setDoctorName] = useState('');
  const [doctorType, setDoctorType] = useState(optionTypes[0].value);
  const schedule_list = useSelector(filterScheduleByDayOfWeek);
  const schedule_list_by_doctor = useSelector(filterScheduleByDoctorName);

  useEffect(() => {
    if (schedule_list.length === 0) {
      dispatch(fetchAllScheduleDoctor());
    }
  }, [selectedDate]);

  useEffect(() => {
    dispatch(updateDoctorType(doctorType));
  }, [doctorType]);

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

      <DropDownPicker
        items={optionTypes}
        _setValue={setDoctorType}
        value={doctorType}
        style={{
          width: '96%',
          margin: 0,
          marginTop: 8,
        }}
        stylePicker={{
          width: '99%',
        }}
        childPicker={{
          marginRight: 0,
        }}
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
    borderWidth: 2,
    borderColor: '#5D90F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 4,
    marginLeft: 24,
    marginRight: 24,
    backgroundColor: '#ffff',
  },
});

export default ScheduleListScreen;
