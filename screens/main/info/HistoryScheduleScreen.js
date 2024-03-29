import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {useEffect, useState} from 'react';
import {getAllHistoriesById} from '../../../services/patient/info';
import moment from 'moment';
import Header from '../../../components/Header';
import {ActivityIndicator, Modal, Portal} from 'react-native-paper';

const specialist = {
  glycemic: 'Đường huyết',
  blood: 'Huyết áp',
};

function HistoryScreen({navigation, route}) {
  const {patient_id} = route.params;
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState('');

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
          histories.map(history => {
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
                  {history.prescription && (
                    <TouchableOpacity
                      onPress={() => {
                        setVisible(history.prescription);
                      }}>
                      <Text
                        style={{
                          color: '#0077b6',
                          textDecorationLine: 'underline',
                          marginTop: 8,
                        }}>
                        {'Xem đơn thuốc'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Portal>
                  <Modal
                    visible={visible}
                    auto
                    onDismiss={() => {
                      setVisible('');
                    }}
                    contentContainerStyle={styles.modal}>
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 16,
                        marginBottom: 16,
                      }}>
                      Đơn thuốc
                    </Text>

                    <Text>{visible}</Text>
                  </Modal>
                </Portal>
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
  modal: {
    backgroundColor: '#fff',
    height: 400,
    marginHorizontal: 8,
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HistoryScreen;
