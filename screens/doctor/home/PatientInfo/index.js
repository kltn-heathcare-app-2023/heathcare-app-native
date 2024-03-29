import AnimatedLottieView from 'lottie-react-native';
import moment from 'moment';
import {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, List, Modal, Portal} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {ANAMNESIS, AVATAR_DEFAULT} from '../../../../common/constant';
import {doctorProfileSelector} from '../../../../redux/selectors/doctor/infoSelector';
import {createRemindToPatient} from '../../../../services/doctor/patient';
import {Root, Popup} from 'popup-ui';
import RouterKey from '../../../../utils/Routerkey';
import Header from '../../../../components/Header';
import {socket} from '../../../../utils/config';

import {Button as ButtonRE} from 'react-native-elements';
function PatientInfo({navigation, route}) {
  const {patient, bmis, glycemics, blood_pressures} = route.params;
  const {person, blood, anamnesis} = patient;
  const doctor_profile = useSelector(doctorProfileSelector);

  const [visible, setVisible] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleSendNoteToPatient = async () => {
    if (note) {
      setLoading(true);
      createRemindToPatient(patient._id, {
        from: doctor_profile.doctor._id,
        content: note,
      })
        .then(({data}) => {
          socket.emit('notification_confirm_register_schedule', {
            data: data,
          });
          Popup.show({
            type: 'Success',
            title: 'Thông báo',
            button: true,
            textBody: 'Gửi nhắc nhở cho bệnh nhân thành công',
            buttontext: 'Nhập ngay',
            callback: () => {
              Popup.hide();
            },
          });
        })
        .catch(({message}) => {
          Popup.show({
            type: 'Warning',
            title: 'Thông báo',
            button: true,
            textBody: message,
            buttontext: 'Nhập ngay',
            callback: () => {
              Popup.hide();
            },
          });
        })
        .finally(() => {
          hideModal();
          setNote('');
          setLoading(false);
          setError(false);
        });
    } else {
      setError(true);
    }
  };

  return (
    <>
      <Header
        title={`Bệnh nhân: ${person.username}`}
        handle={() => navigation.goBack()}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{
              uri:
                patient.person?.avatar !== ''
                  ? patient.person?.avatar
                  : AVATAR_DEFAULT,
            }}
            style={styles.header_image}
          />

          <TouchableOpacity onPress={showModal}>
            <AnimatedLottieView
              source={require('../../../../assets/images/note.json')}
              autoPlay
              loop
              style={{
                width: 48,
                height: 48,
                marginRight: 24,
              }}
            />
          </TouchableOpacity>
        </View>
        <List.Section>
          <List.Subheader>Thông tin cá nhân:</List.Subheader>
          <List.Item title={`Tên: ${person.username}`} />
          <List.Item
            title={`Ngày sinh: ${moment(new Date(person.dob)).format('l')}`}
          />
          <List.Item title={`Địa chỉ: ${person.address}`} />
          <List.Item title={`Giới Tính: ${person.gender ? 'Nam' : 'Nữ'} `} />
          <List.Item title={`Nhóm máu: ${blood}`} />
          <List.Item title={`Tiền sử bệnh: ${ANAMNESIS[anamnesis]}`} />
        </List.Section>

        <List.Section>
          <List.Subheader>Thông tin các chỉ số:</List.Subheader>
          <List.Item
            style={{marginLeft: 16}}
            title={`Chỉ số BMI: ${
              bmis && bmis.length > 0
                ? `${bmis[bmis.length - 1].cal_bmi} - ${moment(
                    bmis[bmis.length - 1].createdAt,
                  ).fromNow()}`
                : 'Chưa cập nhật'
            }`}
            left={() => <List.Icon icon="human-male-height" />}
          />
          <List.Item
            style={{marginLeft: 16}}
            title={`Chỉ số đường huyết: ${
              glycemics && glycemics.length > 0
                ? `${glycemics[glycemics.length - 1].metric} - ${moment(
                    glycemics[glycemics.length - 1].createdAt,
                  ).fromNow()}`
                : 'Chưa cập nhật'
            }`}
            left={() => (
              <List.Icon
                icon={
                  glycemics && glycemics.length > 0
                    ? glycemics[glycemics.length - 1].case === 3
                      ? 'power-sleep'
                      : glycemics[glycemics.length - 1].case === 2
                      ? 'weather-sunny'
                      : 'weather-partly-cloudy'
                    : 'weather-sunny'
                }
              />
            )}
          />
          <List.Item
            style={{marginLeft: 16}}
            title={`Chỉ số huyết áp: ${
              blood_pressures && blood_pressures.length > 0
                ? `${blood_pressures[blood_pressures.length - 1].systolic} - ${
                    blood_pressures[blood_pressures.length - 1].diastole
                  } -  ${moment(
                    blood_pressures[blood_pressures.length - 1].createdAt,
                  ).fromNow()}`
                : 'Chỉ số chưa cập nhật'
            }`}
            left={() => <List.Icon icon={'heart-pulse'} />}
          />
        </List.Section>
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          contentContainerStyle={styles.modal_container}>
          <Text style={styles.modal_title}>Gửi nhắc nhở cho bệnh nhân</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={[styles.textArea]}
              underlineColorAndroid="transparent"
              placeholder="Nhập ghi chú cho bệnh nhân"
              placeholderTextColor="grey"
              numberOfLines={10}
              multiline={true}
              textAlignVertical="top"
              value={note}
              onChangeText={v => setNote(v)}
            />
          </View>
          <Text style={{color: 'red'}}>
            {error && !note && 'Vui lòng nhập ghi chú'}
          </Text>
          <ButtonRE
            title={'Gửi ghi chú'}
            onPress={handleSendNoteToPatient}
            buttonStyle={{width: 164, borderRadius: 8, marginTop: 8}}
            loading={loading}
          />
          {/* <Button
            mode="contained"
            style={{width: '90%', marginTop: 16}}
            onPress={handleSendNoteToPatient}>
            
          </Button> */}
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 24,
    width: '100%',
    height: 64,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header_image: {
    width: 64,
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 50,
    marginLeft: 16,
  },
  doctor_info: {
    backgroundColor: '#a2d2ff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 8,
    borderRadius: 16,
    marginTop: 4,
  },
  doctor_info_image: {
    width: 64,
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  doctor_info_text: {
    marginLeft: 8,
  },
  modal_container: {
    backgroundColor: '#fff',
    width: '95%',
    height: '70%',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 16,
  },
  modal_title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  modal_image: {
    width: 64,
    height: 64,
    backgroundColor: '#ccc',
    borderRadius: 50,
    marginLeft: 16,
    marginVertical: 8,
  },
  textAreaContainer: {
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 5,
    borderRadius: 16,
  },
  textArea: {
    height: 150,
    justifyContent: 'flex-end',
  },
});

export default PatientInfo;
