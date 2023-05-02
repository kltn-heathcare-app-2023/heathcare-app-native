import {View, Text, ScrollView, StyleSheet} from 'react-native';

import {useEffect, useState} from 'react';
import {getAllHistoriesById} from '../../../services/patient/info';
import moment from 'moment';
import Header from '../../../components/Header';
import {ActivityIndicator} from 'react-native-paper';

const specialist = {
  glycemic: 'Đường huyết',
  blood: 'Huyết áp',
};

function HistoryScreen({navigation, route}) {
  const {patient_id} = route.params;
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient_id) {
      setLoading(true);
      getAllHistoriesById(patient_id)
        .then(({data}) => {
          setHistories(data);
        })
        .catch(() => {
          setHistories([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [patient_id]);

  return (
    <>
      <Header handle={() => navigation.goBack()} title={'Lịch sử khám'} />
      <ScrollView>
        {loading ? (
          <View
            style={{
              flex: 1,
              height: 500,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator animating={true} color={'#a8dadc'} />
          </View>
        ) : histories.length > 0 ? (
          histories.reverse().map(history => {
            return (
              <View style={styles.exam_item} key={history._id}>
                <Text style={{fontWeight: '600'}}>
                  Nội dung khám: {history.content_exam}
                </Text>

                <View style={styles.content_exam}>
                  <Text>Kết quả khám: {history.result_exam}</Text>
                  <Text>Bác sĩ khám: {history.doctor.username}</Text>
                  <Text>
                    Chuyên khoa: {specialist[history.doctor.work_type]}
                  </Text>
                  <Text>
                    Ngày khám:{' '}
                    {moment(history.created_at).format('DD/MM/YYYY - HH:mm:ss')}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <View
            style={{
              flex: 1,
              height: 500,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>Bạn chưa có lịch sử khám nào</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  exam_item: {
    padding: 8,
    backgroundColor: '#a8dadc',
    marginBottom: 8,
    borderRadius: 16,
  },
});

export default HistoryScreen;
