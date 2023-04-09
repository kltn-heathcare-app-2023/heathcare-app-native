import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RouterKey from '../../utils/Routerkey';
import {AVATAR_DEFAULT} from '../../common/constant';

function PatientPreview({
  patient,
  status,
  bmis,
  glycemics,
  blood_pressures,
  navigation,
}) {
  return (
    <TouchableOpacity
      key={patient._id}
      style={styles.patient_container}
      onPress={() => {
        navigation.navigate(RouterKey.DOCTOR_HOME_PATIENT_INFO_SCREEN, {
          patient: patient,
          bmis: bmis,
          glycemics: glycemics,
          blood_pressures: blood_pressures,
        });
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
              status.message.code === 2
                ? '#f08080'
                : status.message.code === 1
                ? '#fb8500'
                : status.message.code === 0
                ? '#38a3a5'
                : '#0077b6',
            fontWeight: '600',
          }}>
          {status.message.status}
        </Text>
      </View>
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

export default PatientPreview;
