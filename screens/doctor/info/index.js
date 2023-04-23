import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {List} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {doctorProfileSelector} from '../../../redux/selectors/doctor/infoSelector';
import moment from 'moment';
import {getProfileDoctorById} from '../../../services/doctor/profile';
import {useEffect, useState} from 'react';
import Header from '../../../components/Header';
import {Rating} from 'react-native-elements';

function DoctorInfoScreen({navigation}) {
  const {doctor} = useSelector(doctorProfileSelector);
  const [profile, setProfile] = useState();

  useEffect(() => {
    getProfileDoctorById(doctor._id).then(({data}) => data && setProfile(data));
  }, []);

  return (
    doctor && (
      <KeyboardAvoidingView behavior="position">
        {/* <Header
          title={'Thông tin cá nhân'}
          handle={() => navigation.goBack()}
        /> */}
        <ScrollView style={styles.container}>
          <View style={styles.info}>
            <Image
              source={{uri: doctor.person.avatar}}
              style={styles.info_avatar}
            />
          </View>

          <List.Section>
            <List.Subheader>Thông tin bác sĩ</List.Subheader>
            <List.Item
              style={styles.profile_specialist}
              title={`${doctor.person.username}`}
              left={() => <List.Icon icon="doctor" />}
              // titleStyle={{ fontWeight: "700" }}
            />
            <List.Item
              style={styles.profile_specialist}
              title={`${doctor.person.gender ? 'Nam' : 'Nu'}`}
              left={() => <List.Icon icon="gender-male-female" />}
              // titleStyle={{ fontWeight: "700" }}
            />
            <List.Item
              style={styles.profile_specialist}
              title={`Địa chỉ: ${doctor.person.address}`}
              left={() => <List.Icon icon="sign-direction" />}
              // titleStyle={{ fontWeight: "700" }}
            />

            <List.Item
              style={styles.profile_specialist}
              title={`Ngày sinh: ${moment(doctor.person.dob).format('L')}`}
              left={() => <List.Icon icon="calendar-today" />}
              // titleStyle={{ fontWeight: "700" }}
            />

            <List.Item
              style={styles.profile_specialist}
              title={
                <Rating
                  style={{paddingVertical: 10}}
                  imageSize={18}
                  startingValue={doctor.rating}
                />
              }
              left={() => <List.Icon icon="notebook-check-outline" />}
              titleStyle={{fontWeight: '700'}}
            />
          </List.Section>

          {profile ? (
            <View>
              <List.Section>
                <List.Subheader>Khoa</List.Subheader>
                {profile.specialist.map(special => {
                  return (
                    <List.Item
                      style={styles.profile_specialist}
                      key={special}
                      title={`${special}`}
                      left={() => <List.Icon icon="book-check-outline" />}
                    />
                  );
                })}

                <List.Subheader>Đơn vị đào tạo</List.Subheader>
                <List.Item
                  style={styles.profile_specialist}
                  title={profile.training_place}
                  left={() => <List.Icon icon="school-outline" />}
                />

                <List.Subheader>Bằng cấp</List.Subheader>
                <List.Item
                  style={styles.profile_specialist}
                  title={profile.degree}
                  left={() => <List.Icon icon="application-edit-outline" />}
                />

                <List.Subheader>Nơi làm việc</List.Subheader>
                <List.Item
                  style={styles.profile_specialist}
                  title={profile.work_place ?? 'Chưa cập nhật'}
                  left={() => <List.Icon icon="plus-network-outline" />}
                />

                <List.Subheader>Ngoại ngữ</List.Subheader>
                {profile.languages.map(language => {
                  return (
                    <List.Item
                      style={styles.profile_specialist}
                      key={language}
                      title={`${language}`}
                      left={() => <List.Icon icon="language-xaml" />}
                    />
                  );
                })}

                <List.Subheader>Chuyên điều trị</List.Subheader>
                <List.Item
                  style={styles.profile_specialist}
                  title={profile.education}
                  left={() => <List.Icon icon="clipboard-text-outline" />}
                />

                <List.Subheader>Kinh nghiệm</List.Subheader>
                {profile.experiences.map(experience => {
                  return (
                    <List.Item
                      style={styles.profile_specialist}
                      key={experience}
                      title={`${experience}`}
                      left={() => <List.Icon icon="check" />}
                    />
                  );
                })}
              </List.Section>
            </View>
          ) : (
            <View style={{height: 500}}></View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    )
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    paddingBottom: 16,
  },
  info: {
    marginTop: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  info_avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  info_text: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: '700',
  },
  profile: {
    with: '100%',
  },
  profile_specialist: {
    padding: 16,
  },
});
export default DoctorInfoScreen;
