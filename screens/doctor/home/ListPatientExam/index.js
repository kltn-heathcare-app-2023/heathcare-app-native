import {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Button,
  Divider,
  MD2Colors,
  MD3Colors,
  ProgressBar,
} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {AVATAR_DEFAULT} from '../../../../common/constant';
import {doctorProfileSelector} from '../../../../redux/selectors/doctor/infoSelector';
import {
  getAllScheduleDetailUnAccepted,
  getAllWorkingDay,
  getPatientExamByDoctorId,
} from '../../../../services/doctor/patient';
import RouterKey from '../../../../utils/Routerkey';
import storage from '../../../../utils/storage';

function DoctorHomeListPatientExamScreen({navigation}) {
  const doctor_profile = useSelector(doctorProfileSelector);
  const [patientList, setPatientList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scheduleWaiting, setScheduleWaiting] = useState(0);
  const [numberWorkingDay, setNumberWorkingDay] = useState(0);

  useEffect(() => {
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
          const scheduleUnAccepted = value.data.filter(
            sche => sche.status === false,
          );
          setScheduleWaiting(scheduleUnAccepted.length);
        })
        .catch();

      getAllWorkingDay(doctor_profile.doctor._id)
        .then(value => {
          setNumberWorkingDay(value.data.length);
        })
        .catch();
    }
  }, [doctor_profile]);

  return (
    <>
      {!loading && (
        <View>
          <View
            style={{
              marginTop: 24,
              marginHorizontal: 8,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                height: 80,
                width: 80,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
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
                  top: -5,
                  right: -5,
                  width: 20,
                  height: 24,
                  backgroundColor: '#90e0ef',
                  textAlign: 'center',
                  borderRadius: 16,
                }}>
                {patientList.length}
              </Text>
            </View>

            <View
              style={{
                height: 80,
                width: 80,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
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
                  top: -5,
                  right: -5,
                  width: 20,
                  height: 24,
                  backgroundColor: '#fcbf49',
                  textAlign: 'center',
                  borderRadius: 16,
                }}>
                {scheduleWaiting}
              </Text>
            </View>

            <View
              style={{
                height: 80,
                width: 80,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
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
                  top: -5,
                  right: -5,
                  width: 20,
                  height: 24,
                  backgroundColor: '#06d6a0',
                  textAlign: 'center',
                  borderRadius: 16,
                }}>
                {numberWorkingDay}
              </Text>
            </View>
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
            Danh sách bệnh nhân đang đảm nhận:
          </Text>

          <ScrollView>
            {patientList.length > 0 &&
              patientList.map(
                ({patient, status, bmis, glycemics, blood_pressures}) => {
                  return (
                    <TouchableOpacity
                      key={patient._id}
                      style={styles.patient_container}
                      onPress={() => {
                        navigation.navigate(
                          RouterKey.DOCTOR_HOME_PATIENT_INFO_SCREEN,
                          {
                            patient: patient,
                            bmis: bmis,
                            glycemics: glycemics,
                            blood_pressures: blood_pressures,
                          },
                        );
                      }}>
                      <Image
                        source={{
                          uri:
                            patient.person?.avatar !== ''
                              ? patient.person?.avatar
                              : AVATAR_DEFAULT,
                        }}
                        style={styles.patient_container_image}
                      />
                      <View style={styles.patient_container_right}>
                        <Text>{patient.person.username}</Text>
                        <Text>Nhóm máu: {patient.blood}</Text>
                        <Text
                          style={{
                            width: '100%',
                            height: 'auto',
                            color:
                              status.message.code === 1
                                ? '#fb8500'
                                : status.message.code === 2
                                ? '#f08080'
                                : '#ccc',
                          }}>
                          {status.message.status}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                },
              )}
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
    </>
  );
}

const styles = StyleSheet.create({
  patient_container: {
    width: '98%',
    height: 120,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a2d2ff',
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
});

export default DoctorHomeListPatientExamScreen;
