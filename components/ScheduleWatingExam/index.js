import moment from 'moment';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {ANAMNESIS, AVATAR_DEFAULT} from '../../common/constant';

function ScheduleWaitingExamItem({schedule, handle}) {
  return (
    <TouchableOpacity
      style={styles.patient_container}
      onPress={handle}
      key={schedule._id}>
      <Image
        source={{
          uri:
            schedule?.patient?.person?.avatar !== ''
              ? schedule?.patient?.person?.avatar
              : AVATAR_DEFAULT,
        }}
        style={styles.patient_container_image}
      />
      <View style={styles.patient_container_right}>
        <Text>{schedule?.patient?.person?.username ?? ''}</Text>
        <Text>Nhóm máu: {schedule.patient.blood}</Text>
        <Text>Tiền sử: {ANAMNESIS[schedule.patient.anamnesis]}</Text>
        <Text>
          {`Ngày khám: ${moment(new Date(schedule.day_exam)).format(
            'DD/MM/YYYY - HH:mm',
          )}`}
        </Text>
      </View>

      {moment(schedule.day_exam).diff(new Date(), 'day') === 0 ? (
        schedule.is_exam ? (
          <View style={styles.patient_is_exam}>
            <Text>Đang khám</Text>
          </View>
        ) : (
          <View style={styles.patient_is_exam}>
            <Text>Hôm nay khám</Text>
          </View>
        )
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  patient_container: {
    width: '98%',
    height: 120,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#57cc99',
    marginHorizontal: 4,
    padding: 8,
    marginTop: 8,
    borderRadius: 16,
  },
  patient_container_image: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  patient_container_right: {
    width: '70%',
    marginLeft: 8,
  },
  patient_is_exam: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#a2d2ff',
    width: 100,
    height: 36,
    borderTopRightRadius: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default ScheduleWaitingExamItem;
