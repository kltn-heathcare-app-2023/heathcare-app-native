import moment from 'moment';
import {useState} from 'react';
import {Alert} from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {Button, Modal, Portal, TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {MESSAGE_MISS_DATA} from '../../../common/message';
import {TITLE_NOTIFICATION} from '../../../common/title';
import {
  infoSelector,
  userLastGlycemicSelector,
  userListGlycemicSelector,
} from '../../../redux/selectors/infoSelector';
import {infoSlice} from '../../../redux/slices/infoSlice';
import {postGlycemic} from '../../../services/patient/info';

const screenWidth = Dimensions.get('window').width;

let data = {
  datasets: [
    {
      data: [],
    },
  ],
  legend: ['Biểu đồ theo dõi chỉ số  đường huyết theo tuần'], // optional
};

const chartConfig = {
  backgroundGradientFrom: '#ffff',
  backgroundGradientTo: '#ffff',
  color: (opacity = 1) => `rgba(244, 115, 115, ${opacity})`, // optional
  barPercentage: 0.5,
  strokeWidth: 2, // optional
  useShadowColorFromDataset: true, // optional
};

function GlycemicScreen() {
  const [visible, setVisible] = useState(false);
  const [glycemic, setGlycemic] = useState('');

  const glycemic_list = useSelector(userListGlycemicSelector);
  const glycemic_last = useSelector(userLastGlycemicSelector);
  const user_info = useSelector(infoSelector);
  const metrics = glycemic_list.map(glycemic => glycemic.metric);

  const labels = glycemic_list.map(glycemic =>
    moment(glycemic.createdAt).format('dddd'),
  );

  const dispatch = useDispatch();

  // console.log(glycemic_list);
  data.labels = labels;
  data.datasets[0] = {data: metrics.length > 0 ? metrics : []};

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handlePostGlycemic = () => {
    if (glycemic && glycemic > 0) {
      postGlycemic({
        metric: glycemic,
        case: 2,
        patient: user_info._id,
      })
        .then(({data}) => {
          dispatch(infoSlice.actions.addGlycemic(data));
          setVisible(false);
        })
        .catch(error => {
          Alert.alert(TITLE_NOTIFICATION, error.message);
          setVisible(false);
        });
    } else {
      Alert.alert(TITLE_NOTIFICATION, MESSAGE_MISS_DATA);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bmi_container}>
        <View style={styles.bmi_text}>
          <Text style={styles.bmi_text_title}>
            {`Chỉ số đường huyết mới nhất: ${glycemic_last}`}
          </Text>
          <Text>
            {glycemic_list[glycemic_list.length - 1]?.notification ??
              `Bạn cần ăn uống điều độ hơn và chú ý sức khỏe`}
          </Text>
        </View>
        <Image
          style={styles.header_info_img}
          source={require('../../../assets/images/glycemic.png')}
        />
      </View>

      {metrics.length > 0 && (
        <LineChart
          data={data}
          width={screenWidth - 16}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero
          onDataPointClick={({value}) => {
            console.log(value);
          }}
        />
      )}

      <Portal>
        <Modal
          visible={visible}
          auto
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}>
          <Text>Chỉ số đường huyết hôm nay</Text>

          <TextInput
            placeholder="Đường huyết (mg/dl)"
            style={styles.modal_input}
            value={glycemic}
            onChangeText={val => setGlycemic(val)}
            keyboardType="decimal-pad"
          />

          <Button
            mode="elevated"
            onPress={handlePostGlycemic}
            style={styles.modal_button}>
            Gửi
          </Button>
        </Modal>
      </Portal>

      <TouchableOpacity style={styles.btn_container} onPress={showModal}>
        <Text style={styles.btn_text}>{'Nhập đường huyết cho hôm nay'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  header_info_img: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  bmi_container: {
    width: '100%',
    height: 'auto',
    borderWidth: 2,
    borderColor: '#219ebc',
    borderRadius: 16,
    padding: 8,
    marginTop: 8,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bmi_text: {
    width: '75%',
  },
  bmi_text_title: {
    fontSize: 16,
    fontWeight: '700',
  },
  chart: {
    marginTop: 8,
    borderRadius: 16,
  },

  btn_container: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    backgroundColor: '#e76f51',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e76f51',
    marginTop: 16,
  },
  btn_text: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginTop: 12,
  },
  modal: {
    backgroundColor: '#fff',
    height: 400,
    marginHorizontal: 8,
    borderRadius: 16,
    padding: 20,
  },
  modal_title: {},
  modal_input: {
    marginTop: 8,
  },
  modal_button: {
    marginTop: 12,
  },
});

export default GlycemicScreen;
