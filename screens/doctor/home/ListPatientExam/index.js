import {useEffect, useMemo, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useNotification} from 'react-native-internal-notification';
import {
  ActivityIndicator,
  Button,
  List,
  MD2Colors,
  Modal,
  Portal,
  TextInput,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {ANAMNESIS, AVATAR_DEFAULT} from '../../../../common/constant';
import {doctorProfileSelector} from '../../../../redux/selectors/doctor/infoSelector';
import {notification_list_selector} from '../../../../redux/slices/notificationSlice';
import {
  acceptScheduleDetailByScheduleId,
  createResultExamAfterExam,
  getAllScheduleDetailUnAccepted,
  getAllScheduleWaitingExam,
  getPatientExamByDoctorId,
} from '../../../../services/doctor/patient';
import RouterKey from '../../../../utils/Routerkey';

import Icon from 'react-native-vector-icons/Ionicons';
import {doctorInfoSlice} from '../../../../redux/slices/doctor/doctorInfoSlice';
import storage from '../../../../utils/storage';
import PatientPreview from '../../../../components/PatientPreview';
import moment from 'moment';
import {cancelScheduleDetail} from '../../../../services/patient/schedule_detail';
import {socket} from '../../../../utils/config';
import {Root, Popup} from 'popup-ui';
import {doctorConversationSlice} from '../../../../redux/slices/doctor/doctorConversationSlice';
import ScheduleWaitingItem from '../../../../components/ScheduleWating';
import ScheduleWaitingExamItem from '../../../../components/ScheduleWatingExam';
import DropDownPicker from '../../../../components/Input/DropdownPicker';
import {anamnesisITems} from '../../../utils/SendInformationScreen';

function DoctorHomeListPatientExamScreen({navigation, route}) {
  const {schedule_detail_id = ''} = route.params ?? {schedule_detail_id: ''};

  const dispatch = useDispatch();
  const notification_list = useSelector(notification_list_selector);
  const doctor_profile = useSelector(doctorProfileSelector);

  const notification = useNotification();

  const [loading, setLoading] = useState(false);
  const [scheduleWaiting, setScheduleWaiting] = useState(0);
  const [option, setOption] = useState(0);
  const [patientList, setPatientList] = useState([]);
  const [scheduleWaitingList, setScheduleWaitingList] = useState([]);
  const [scheduleWaitingExam, setScheduleWaitingExam] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleWaitingExam, setVisibleWaitingExam] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [isOpenInput, setIsOpenInput] = useState(false);
  const [reason, setReason] = useState('');

  const last_notification = notification_list[notification_list.length - 1];

  const [scheduleDetail, setScheduleDetail] = useState('');
  const [note, setNote] = useState('');
  const [anamnesis, setAnamnesis] = useState('0');
  const [loadingSend, setLoadingSend] = useState(false);

  useEffect(() => {
    if (
      last_notification &&
      doctor_profile &&
      Object.keys(doctor_profile).length > 0
    ) {
      if (!last_notification.hasSeen) {
        notification.showNotification({
          title: 'Thông báo',
          message: last_notification.content,
          icon: <Icon name={'ios-notifications-outline'} size={24} />,
          color: '#fff',
        });
      }
    }

    setLoading(true);
    if (doctor_profile?.doctor?._id) {
      getPatientExamByDoctorId(doctor_profile.doctor._id)
        .then(value => {
          setPatientList(value.data);
          setLoading(false);
        })
        .catch();

      getAllScheduleDetailUnAccepted(doctor_profile.doctor._id)
        .then(value => {
          const count_waiting_schedule = value.data.length;
          setScheduleWaitingList(value.data);
          setScheduleWaiting(count_waiting_schedule);
        })
        .catch();

      getAllScheduleWaitingExam(doctor_profile.doctor._id)
        .then(value => {
          setScheduleWaitingExam(value.data);
        })
        .catch();
    }

    doctor_profile.doctor && socket.emit('add_user', doctor_profile.doctor._id);
  }, [doctor_profile]);

  useEffect(() => {
    socket.on('notification_register_schedule_from_patient_success', resp => {
      const {notification, schedule_detail} = resp;
      setScheduleWaitingList(prev => {
        const index = scheduleWaitingList.findIndex(
          schedule => schedule._id === schedule_detail._id,
        );
        if (index > -1) return prev;
        return [schedule_detail, ...prev];
      });
      setScheduleWaiting(prev => prev + 1);
    });
  }, []);

  useEffect(() => {
    setScheduleDetail(schedule_detail_id);
  }, [schedule_detail_id]);

  const handleLogoutByDoctor = async () => {
    navigation.navigate(RouterKey.LOGIN_SCREEN);
    await storage.remove('accessToken');
    dispatch(doctorInfoSlice.actions.resetDoctorProfile());
  };

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setIsOpenInput(false);
  };

  const handleClickPreviewSchedule = schedule => {
    setSchedule(schedule);
    showModal();
  };

  const handleClickViewScheduleWatingExam = schedule => {
    setSchedule(schedule);
    setVisibleWaitingExam(true);
  };

  const handleCancelScheduleDetail = async schedule_id => {
    if (reason) {
      try {
        const {schedule_detail_id, notification} = await cancelScheduleDetail(
          schedule_id,
          {
            reason,
            from: doctor_profile.doctor._id,
          },
        );

        if (notification) {
          socket.emit('notification_confirm_register_schedule', {
            data: {notification},
          });
        }
        if (schedule_detail_id) {
          setReason('');
          hideModal();
          setScheduleWaitingList(
            scheduleWaitingList.filter(
              schedule => schedule._id !== schedule_detail_id,
            ),
          );
          setScheduleWaiting(prev => prev - 1);
          Popup.show({
            type: 'Success',
            title: 'Thông báo',
            button: true,
            textBody: `Hủy lịch thành công!`,
            buttontext: 'Nhập ngay',
            callback: () => {
              Popup.hide();
            },
          });
        }
      } catch (error) {
        setReason('');
        hideModal();
        Popup.show({
          type: 'Danger',
          title: 'Lỗi',
          button: true,
          textBody: `${error.res.message}`,
          buttontext: 'Nhập ngay',
          callback: () => {
            // navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
            //   screen: RouterKey.INFO_SCREEN,
            // });
            Popup.hide();
          },
        });
      }
    }
  };

  const handleAcceptScheduleDetail = async schedule_id => {
    acceptScheduleDetailByScheduleId(schedule_id)
      .then(({schedule_detail, notification, conversation}) => {
        hideModal();
        if (notification) {
          socket.emit('notification_confirm_register_schedule', {
            data: {notification},
          });
        }
        if (conversation) {
          console.log(conversation);
          dispatch(
            doctorConversationSlice.actions.pushConversationAfterAcceptSchedule(
              conversation,
            ),
          );
        }

        setScheduleWaitingList(
          scheduleWaitingList.filter(
            schedule => schedule._id !== schedule_detail._id,
          ),
        );
        setScheduleWaitingExam(prev => [...prev, schedule_detail]);
        setScheduleWaiting(prev => prev - 1);
        setVisible(false);
        setVisibleWaitingExam(false);
        Popup.show({
          type: 'Success',
          title: 'Thông báo',
          button: true,
          textBody: `Xác nhận lịch thành công!`,
          buttontext: 'Nhập ngay',
          callback: () => {
            Popup.hide();
          },
        });
      })
      .catch(() => {
        hideModal();
        Popup.show({
          type: 'Danger',
          title: 'Lỗi',
          button: true,
          textBody: `Có lỗi xảy ra khi xác nhận lịch`,
          buttontext: 'Nhập ngay',
          callback: () => {
            // navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
            //   screen: RouterKey.INFO_SCREEN,
            // });
            Popup.hide();
          },
        });
      });
  };

  const handleSendResultExamToPatient = () => {
    if (note.trim()) {
      setLoadingSend(true);
      createResultExamAfterExam(scheduleDetail, {result_exam: note, anamnesis})
        .then(value => {
          setScheduleWaitingExam(prev =>
            prev.filter(schedule => schedule._id !== scheduleDetail),
          );
        })
        .catch(err => console.error(err))
        .finally(() => {
          navigation.setParams({schedule_detail_id: ''});
          setScheduleDetail('');
          setNote('');
          setAnamnesis('0');
          setLoadingSend(false);
        });
    } else {
      setNote('Sức khỏe của bạn bình thường, cố gắng duy trì nhé!');
    }
  };

  const ModalShowPreviewScheduleWaiting = useMemo(() => {
    return (
      <>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modal}>
            <Text style={styles.modal_title}>
              {'Thông tin chi tiết ca khám'}
            </Text>
            {schedule && (
              <Image
                source={{uri: schedule.patient.person.avatar}}
                style={styles.modal_image}
              />
            )}
            {schedule && (
              <>
                <List.Section style={{width: '100%'}}>
                  <List.Subheader>Thông tin bệnh nhân:</List.Subheader>
                  <List.Item
                    style={styles.modal_profile_specialist}
                    title={`${schedule.patient.person.username}`}
                    left={() => <List.Icon icon="doctor" />}
                  />
                  <List.Item
                    style={styles.modal_profile_specialist}
                    title={`${schedule.patient.person.gender ? 'Nam' : 'Nu'}`}
                    left={() => <List.Icon icon="gender-male-female" />}
                  />
                </List.Section>
                <List.Section style={{width: '100%'}}>
                  <List.Subheader>Thông tin ca khám:</List.Subheader>
                  <List.Item
                    style={[styles.modal_profile_specialist, {height: 'auto'}]}
                    title={`${schedule.content_exam}`}
                    left={() => <List.Icon icon="clipboard-search-outline" />}
                  />
                  <List.Item
                    style={styles.modal_profile_specialist}
                    title={`${moment(new Date(schedule.day_exam)).format(
                      'llll',
                    )}`}
                    left={() => <List.Icon icon="calendar-check" />}
                  />
                </List.Section>
              </>
            )}

            {!schedule?.status && (
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
                    <>
                      <Button
                        mode="elevated"
                        onPress={() => handleCancelScheduleDetail(schedule._id)}
                        style={{width: '45%'}}
                        labelStyle={{width: '100%'}}>
                        Xác nhận
                      </Button>
                      <Button
                        mode="elevated"
                        onPress={() => setIsOpenInput(false)}
                        buttonColor={'#f4a259'}
                        textColor={'#000'}
                        style={{width: '45%'}}
                        labelStyle={{width: '100%'}}>
                        Thoát
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        mode="elevated"
                        onPress={() => setIsOpenInput(true)}
                        style={{width: '45%'}}
                        labelStyle={{width: '100%'}}>
                        Hủy
                      </Button>
                      <Button
                        mode="elevated"
                        onPress={() => handleAcceptScheduleDetail(schedule._id)}
                        buttonColor={'#06d6a0'}
                        textColor={'#000'}
                        style={{width: '45%'}}
                        labelStyle={{width: '100%'}}>
                        Xác nhận
                      </Button>
                    </>
                  )}
                </View>
              </>
            )}
          </Modal>
        </Portal>
      </>
    );
  }, [visible, isOpenInput]);

  const ModalShowPreviewScheduleWaitingExam = useMemo(() => {
    return (
      <>
        <Portal>
          <Modal
            visible={visibleWaitingExam}
            onDismiss={() => setVisibleWaitingExam(false)}
            contentContainerStyle={styles.modal}>
            <Text style={styles.modal_title}>
              {'Thông tin chi tiết ca khám'}
            </Text>
            {schedule && (
              <Image
                source={{uri: schedule.patient.person.avatar}}
                style={styles.modal_image}
              />
            )}
            {schedule && (
              <>
                <List.Section style={{width: '100%'}}>
                  <List.Subheader>Thông tin bệnh nhân:</List.Subheader>
                  <List.Item
                    style={styles.modal_profile_specialist}
                    title={`${schedule.patient.person.username}`}
                    left={() => <List.Icon icon="doctor" />}
                  />
                  <List.Item
                    style={styles.modal_profile_specialist}
                    title={`${schedule.patient.person.gender ? 'Nam' : 'Nu'}`}
                    left={() => <List.Icon icon="gender-male-female" />}
                  />
                </List.Section>
                <List.Section style={{width: '100%'}}>
                  <List.Subheader>Thông tin ca khám:</List.Subheader>
                  <List.Item
                    style={[styles.modal_profile_specialist, {height: 'auto'}]}
                    title={`${schedule.content_exam}`}
                    left={() => <List.Icon icon="clipboard-search-outline" />}
                  />
                  <List.Item
                    style={styles.modal_profile_specialist}
                    title={`${moment(new Date(schedule.day_exam)).format(
                      'llll',
                    )}`}
                    left={() => <List.Icon icon="calendar-check" />}
                  />
                </List.Section>
              </>
            )}
            <View style={styles.modal_buttons}>
              <Button
                mode="elevated"
                onPress={() => {
                  navigation.navigate(RouterKey.CALL_VIDEO_SCREEN, {
                    room_id: schedule.conversation_id,
                    schedule_detail_id: schedule._id,
                  });
                  setVisibleWaitingExam(false);
                }}
                style={{width: '45%'}}
                labelStyle={{width: '100%'}}>
                Tạo phòng
              </Button>
              <Button
                mode="elevated"
                onPress={() => setVisibleWaitingExam(false)}
                buttonColor={'#f4a259'}
                textColor={'#000'}
                style={{width: '45%'}}
                labelStyle={{width: '100%'}}>
                Thoát
              </Button>
            </View>
          </Modal>
        </Portal>
      </>
    );
  }, [visibleWaitingExam]);

  const ModalShowInputResultExamAfterExam = useMemo(() => {
    return (
      <>
        <Portal>
          <Modal
            visible={scheduleDetail}
            onDismiss={() => setVisibleWaitingExam(false)}
            contentContainerStyle={styles.modal}>
            <Text style={styles.modal_title}>
              {'Đánh giá bệnh nhân sau khi khám'}
            </Text>
            <TextInput
              style={{width: '100%', marginTop: 8}}
              placeholder="Nhập ghi chú"
              placeholderTextColor="grey"
              numberOfLines={10}
              multiline={true}
              textAlignVertical="top"
              value={note}
              onChangeText={v => setNote(v)}
            />
            <DropDownPicker
              value={anamnesis}
              _setValue={setAnamnesis}
              items={anamnesisITems}
              isBlood
              style={{width: '100%'}}
              stylePicker={{width: '92%'}}
            />
            <Button
              mode="contained"
              onPress={handleSendResultExamToPatient}
              disabled={loadingSend}>
              Xác nhận
            </Button>
            {loadingSend && (
              <ActivityIndicator
                animating={true}
                color={'#8ecae6'}
                style={{marginTop: 16}}
                size={'small'}
              />
            )}
          </Modal>
        </Portal>
      </>
    );
  }, [scheduleDetail, note, anamnesis, loadingSend]);

  return (
    <>
      {!loading && (
        <View style={{backgroundColor: '#fff'}}>
          <View
            style={{
              marginTop: 24,
              marginHorizontal: 8,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => setOption(0)}
              style={{
                height: 80,
                width: 80,
                borderWidth: 1,
                borderColor: option === 0 ? '#000' : '#ccc',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
                position: 'relative',
              }}>
              <Image
                source={require('../../../../assets/images/patient.png')}
                style={{width: 48, height: 48}}
              />
              <Text
                style={{
                  fontWeight: '800',
                  fontSize: 16,
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  width: 24,
                  height: 24,
                  backgroundColor: '#90e0ef',
                  textAlign: 'center',
                  borderRadius: 16,
                }}>
                {patientList.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setOption(1)}
              style={{
                height: 80,
                width: 80,
                borderWidth: 1,
                borderColor: option === 1 ? '#000' : '#ccc',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
                position: 'relative',
              }}>
              <Image
                source={require('../../../../assets/images/project.png')}
                style={{width: 48, height: 48}}
              />
              <Text
                style={{
                  fontWeight: '800',
                  fontSize: 16,
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  width: 24,
                  height: 24,
                  backgroundColor: '#fcbf49',
                  textAlign: 'center',
                  borderRadius: 16,
                }}>
                {scheduleWaiting}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setOption(2)}
              style={{
                height: 80,
                width: 80,
                borderWidth: 1,
                borderColor: option === 2 ? '#000' : '#ccc',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
                position: 'relative',
              }}>
              <Image
                source={require('../../../../assets/images/doctor.png')}
                style={{width: 52, height: 48}}
              />
              <Text
                style={{
                  fontWeight: '800',
                  fontSize: 16,
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  width: 24,
                  height: 24,
                  backgroundColor: '#06d6a0',
                  textAlign: 'center',
                  borderRadius: 16,
                }}>
                {scheduleWaitingExam.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogoutByDoctor}
              style={{
                height: 80,
                width: 80,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
              }}>
              <Image
                source={require('../../../../assets/images/logout.png')}
                style={{width: 52, height: 48}}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              marginTop: 16,
              borderBottomColor: '#ccc',
              borderBottomWidth: 2,
              marginHorizontal: 8,
            }}>
            {option === 0
              ? 'Danh sách bệnh nhân đang đảm nhận:'
              : option === 1
              ? 'Danh sách lịch khám đợi duyệt:'
              : 'Danh sách bệnh nhân đợi khám'}
          </Text>

          <ScrollView style={{height: '78%'}}>
            {/* show list patient exam */}
            {patientList.length > 0 &&
              option === 0 &&
              patientList.map(
                ({patient, status, bmis, glycemics, blood_pressures}) => {
                  return (
                    <PatientPreview
                      patient={patient}
                      status={status}
                      bmis={bmis}
                      glycemics={glycemics}
                      blood_pressures={blood_pressures}
                      navigation={navigation}
                      key={patient._id}
                    />
                  );
                },
              )}

            {/* Show list schedule waiting */}
            {scheduleWaitingList.length > 0 &&
              option === 1 &&
              scheduleWaitingList.map(schedule => {
                return (
                  <ScheduleWaitingItem
                    schedule={schedule}
                    handle={() => handleClickPreviewSchedule(schedule)}
                    key={schedule._id}
                  />
                );
              })}

            {/* Show list schedule waiting */}
            {scheduleWaitingList.length > 0 &&
              option === 2 &&
              scheduleWaitingExam.map(schedule => {
                return (
                  <ScheduleWaitingExamItem
                    schedule={schedule}
                    handle={() => handleClickViewScheduleWatingExam(schedule)}
                    key={schedule._id}
                  />
                );
              })}
          </ScrollView>
        </View>
      )}

      {loading && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            animating={true}
            color={MD2Colors.blueA100}
            size={'large'}
          />
        </View>
      )}

      {ModalShowPreviewScheduleWaiting}
      {ModalShowPreviewScheduleWaitingExam}
      {ModalShowInputResultExamAfterExam}
    </>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    height: 584,
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

export default DoctorHomeListPatientExamScreen;
