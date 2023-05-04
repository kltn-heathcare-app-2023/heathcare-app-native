import moment from 'moment';
import {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Button, Chip, List, Modal, Portal, TextInput} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {scheduleDetailSlice} from '../../redux/slices/scheduleDetailSlice';
import {
  cancelScheduleDetail,
  updateScheduleExamStatus,
} from '../../services/patient/schedule_detail';
import {socket} from '../../utils/config';
import RouterKey from '../../utils/Routerkey';

import {Root, Popup} from 'popup-ui';
function ScheduleItem({schedule, navigation, dateSelected, isHome, userId}) {
  const {
    _id,
    doctor,
    time,
    day_exam,
    status,
    content_exam,
    is_exam,
    conversation_id,
    fee,
  } = schedule;

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [isOpenInput, setIsOpenInput] = useState(false);
  const [reason, setReason] = useState('');

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleClickScheduleItem = () => {
    navigation.navigate(RouterKey.SCHEDULE_DETAIL_SCREEN, {
      schedule: schedule,
      dateSelected,
    });
  };

  const handleCancelScheduleDetail = async () => {
    if (reason) {
      try {
        const {schedule_detail_id, notification} = await cancelScheduleDetail(
          _id,
          {
            reason,
            from: userId,
          },
        );

        if (notification) {
          socket.emit('notification_register_schedule_from_patient', {
            data: {notification},
          });
        }
        if (schedule_detail_id) {
          setReason('');
          setVisible(false);
          dispatch(
            scheduleDetailSlice.actions.removeScheduleDetail(
              schedule_detail_id,
            ),
          );

          Popup.show({
            type: 'Success',
            title: 'Thông báo',
            button: true,
            textBody: 'Hủy lịch khám thành công',
            buttontext: 'Nhập ngay',
            callback: () => {
              Popup.hide();
            },
          });
        }
      } catch ({message}) {
        console.error(message);
        Popup.show({
          type: 'Danger',
          title: 'Thông báo',
          button: true,
          textBody: message,
          buttontext: 'Nhập ngay',
          callback: () => {
            Popup.hide();
          },
        });
      }
    }
  };

  const handleCallVideo = () => {
    updateScheduleExamStatus(_id, {is_exam: true})
      .then(value => {
        console.log('send req ->', value);
        navigation.navigate(RouterKey.CALL_VIDEO_SCREEN, {
          room_id: conversation_id ?? '',
          schedule_detail_id: _id ?? '',
          doctor_id: doctor._id ?? '',
        });

        hideModal();
      })
      .catch();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        key={schedule._id}
        onPress={isHome ? showModal : handleClickScheduleItem}>
        <Image
          source={{
            uri: doctor.person.avatar,
          }}
          style={styles.avatar}
        />
        <View>
          {isHome ? (
            <Text style={{marginBottom: 8}}>
              {moment(new Date(day_exam)).format('LLL')}
            </Text>
          ) : (
            <Text style={{marginBottom: 8}}>Thời gian: {time.desc}</Text>
          )}
          <Text style={{marginBottom: 8}}>
            Bác sĩ: {doctor.person.username}
          </Text>
          {!isHome && (
            <Text>{`Chi phí: ${fee.toLocaleString('vi', {
              style: 'currency',
              currency: 'VND',
            })}`}</Text>
          )}
          {isHome && (
            <Chip
              icon={
                status
                  ? moment(day_exam).format('DD/MM/YYYY') ===
                    moment(new Date()).format('DD/MM/YYYY')
                    ? 'archive-clock-outline'
                    : 'check'
                  : 'calendar-clock-outline'
              }
              style={[
                styles.chip,
                {
                  backgroundColor: status
                    ? moment(day_exam).format('DD/MM/YYYY') ===
                      moment(new Date()).format('DD/MM/YYYY')
                      ? '#57c4e5'
                      : '#0ead69'
                    : '#f4a259',
                },
              ]}>
              {status
                ? moment(day_exam).format('DD/MM/YYYY') ===
                  moment(new Date()).format('DD/MM/YYYY')
                  ? is_exam
                    ? 'BS đang đợi'
                    : 'Hôm nay khám'
                  : 'Đã xác nhận'
                : 'Đang đợi duyệt'}
            </Chip>
          )}
        </View>
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}>
          <Text style={styles.modal_title}>{'Thông tin chi tiết ca khám'}</Text>
          <Image
            source={{uri: doctor.person.avatar}}
            style={styles.modal_image}
          />
          <List.Section style={{width: '100%'}}>
            <List.Subheader>Thông tin bác sĩ:</List.Subheader>
            <List.Item
              style={styles.modal_profile_specialist}
              title={`${doctor.person.username}`}
              left={() => <List.Icon icon="doctor" />}
            />
            <List.Item
              style={styles.modal_profile_specialist}
              title={`${doctor.person.gender ? 'Nam' : 'Nu'}`}
              left={() => <List.Icon icon="gender-male-female" />}
            />
          </List.Section>
          <List.Section style={{width: '100%'}}>
            <List.Subheader>Thông tin ca khám:</List.Subheader>
            <List.Item
              style={[styles.modal_profile_specialist, {height: 'auto'}]}
              title={`${content_exam}`}
              left={() => <List.Icon icon="clipboard-search-outline" />}
            />
            <List.Item
              style={styles.modal_profile_specialist}
              title={`${moment(new Date(day_exam)).format('llll')}`}
              left={() => <List.Icon icon="calendar-check" />}
            />
          </List.Section>

          {status ? (
            <>
              <Button
                mode="elevated"
                onPress={hideModal}
                buttonColor={'#f4a259'}
                textColor={'#000'}
                style={{width: '100%'}}
                labelStyle={{width: '100%'}}>
                {'Thoát'}
              </Button>

              {moment(day_exam).diff(new Date(), 'day') === 0 && (
                <Button
                  mode="elevated"
                  onPress={handleCallVideo}
                  buttonColor={'#57c4e5'}
                  textColor={'#000'}
                  style={{width: '100%', marginTop: 12}}
                  labelStyle={{width: '100%'}}>
                  {is_exam ? 'Vào lại' : 'Tham gia'}
                </Button>
              )}
            </>
          ) : (
            <>
              {isOpenInput && (
                <TextInput
                  style={{
                    width: '100%',
                    marginBottom: 16,
                  }}
                  mode={'outlined'}
                  placeholder={'Nhập lý do hủy khám'}
                  value={reason}
                  onChangeText={val => setReason(val)}
                />
              )}
              <View style={styles.modal_buttons}>
                {isOpenInput ? (
                  <Button
                    mode="elevated"
                    onPress={handleCancelScheduleDetail}
                    style={{width: '60%'}}
                    labelStyle={{width: '100%'}}>
                    Xác nhận
                  </Button>
                ) : (
                  <Button
                    mode="elevated"
                    onPress={() => setIsOpenInput(true)}
                    style={{width: '40%'}}
                    labelStyle={{width: '100%'}}>
                    Hủy
                  </Button>
                )}
                <Button
                  mode="elevated"
                  onPress={hideModal}
                  buttonColor={'#f4a259'}
                  textColor={'#000'}
                  style={{width: '40%'}}
                  labelStyle={{width: '100%'}}>
                  Thoát
                </Button>
              </View>
            </>
          )}
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#bde0fe',
    minHeight: 100,
    height: 'auto',
    margin: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#a2d2ff',
    borderRadius: 16,
    marginTop: 4,
  },
  avatar: {
    width: 100,
    height: 90,
    margin: 8,
    borderRadius: 16,
  },
  chip: {
    marginVertical: 4,
    width: 150,
    height: 40,
  },
  modal: {
    backgroundColor: '#fff',
    height: 600,
    marginHorizontal: 8,
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modal_title: {
    fontSize: 16,
    fontWeight: '700',
  },
  modal_image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginTop: 16,
  },
  modal_profile_specialist: {
    paddingLeft: 16,
  },
  modal_buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
  },
});

export default ScheduleItem;
