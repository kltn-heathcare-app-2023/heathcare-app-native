import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  userBMIListSelector,
  infoSelector,
  userAVGBMISelector,
  notificationByBMIMertric,
  userBMIListSelectorFilter,
} from '../../../redux/selectors/infoSelector';
import {Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {Portal, Modal, TextInput, Button} from 'react-native-paper';
import {postBMI} from '../../../services/patient/info';
import {infoSlice} from '../../../redux/slices/infoSlice';

import DropDownPicker from '../../../components/Input/DropdownPicker';
import {socket} from '../../../utils/config';
import {Popup} from 'popup-ui';
import Header from '../../../components/Header';
import RouterKey from '../../../utils/Routerkey';

import {Button as ButtonRE} from 'react-native-elements';
const screenWidth = Dimensions.get('window').width;

let data = {
  datasets: [
    {
      data: [],
    },
  ],
  legend: ['Biểu đồ theo dõi chỉ số  BMI theo tuần'], // optional
};

const chartConfig = {
  backgroundGradientFrom: '#ffff',
  backgroundGradientTo: '#ffff',
  color: (opacity = 1) => `rgba(89, 192, 122, ${opacity})`, // optional
  barPercentage: 0.5,
  strokeWidth: 2, // optional
  useShadowColorFromDataset: true, // optional
};

const optionItems = [
  {label: 'Tuần', value: 'week'},
  {label: 'Tháng', value: 'month'},
];

function BMIScreen({navigation}) {
  const [visible, setVisible] = useState(false);
  const [height, setHeight] = useState('0');
  const [weight, setWeight] = useState('0');
  const [option, setOption] = useState('week');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const bmi_avg_selector = useSelector(userAVGBMISelector);
  const user_info = useSelector(infoSelector);
  const notification = useSelector(notificationByBMIMertric);
  const bmi_selector = useSelector(userBMIListSelectorFilter);
  const bmis = bmi_selector;

  const metrics = bmis.map(bmi => bmi.cal_bmi);
  const labels = bmis.map(bmi =>
    option === 'week'
      ? moment(bmi.createdAt).format('l')
      : moment(bmi.createdAt).format('l').split('/')[0],
  );

  data.labels = labels;
  data.datasets[0] = {data: metrics.length > 0 ? metrics : []};

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    dispatch(infoSlice.actions.updateOptionBMI(option));
  }, [option]);

  const handleSendBMI = async () => {
    setLoading(true);
    const data = {
      patient: user_info._id,
      height: parseFloat(height),
      weight: parseFloat(weight),
      gender: user_info.person.gender,
    };
    postBMI(data)
      .then(({data}) => {
        {
          const {avgBMI, doc, notifications, rule} = data;
          console.log(data);
          notifications &&
            notifications.length > 0 &&
            notifications.forEach(notification => {
              console.log({notification});
              socket.emit('notification_register_schedule_from_patient', {
                data: {notification},
              });
            });
          // console.log(bmi);
          Popup.show({
            type: 'Success',
            title: 'Thông báo sức khỏe',
            button: true,
            textBody: rule?.notification ?? '',
            buttontext: 'Nhập ngay',
            callback: () => {
              // navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
              //   screen: RouterKey.INFO_SCREEN,
              // });
              Popup.hide();
            },
          });
          dispatch(infoSlice.actions.updateAVGBMI(avgBMI));
          dispatch(infoSlice.actions.addBMI(doc));
        }
      })
      .catch(({error, message}) => {
        Popup.show({
          type: 'Danger',
          title: 'Chú ý',
          button: true,
          textBody: `${message}`,
          buttontext: 'OK',
          timing: 3000,
          callback: () => {
            // navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
            //   screen: RouterKey.INFO_SCREEN,
            // });
            Popup.hide();
          },
        });
      })
      .finally(() => {
        hideModal();
        setLoading(false);
      });
  };

  return (
    <>
      <Header
        handle={() => navigation.navigate(RouterKey.INFO_SCREEN)}
        title={'Chỉ số sức khỏe'}
      />
      <View style={styles.container}>
        <View style={styles.bmi_container}>
          <View style={styles.bmi_text}>
            <Text style={styles.bmi_text_title}>
              {`Chỉ số BMI Trung Bình: ${bmi_avg_selector}`}
            </Text>
            <Text>
              {notification || `Bạn cần ăn uống điều độ hơn và chú ý sức khỏe`}
            </Text>
          </View>
          <Image
            style={styles.header_info_img}
            source={require('../../../assets/images/bmi.png')}
          />
        </View>

        <DropDownPicker
          items={optionItems}
          _setValue={setOption}
          value={option}
          style={{
            width: '100%',
            margin: 0,
            marginTop: 8,
          }}
          stylePicker={{
            width: '99%',
          }}
          childPicker={{
            marginRight: 0,
          }}
        />

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
            <Text>Chỉ số BMI hôm nay</Text>

            <TextInput
              placeholder="Chiều cao (cm)"
              style={styles.modal_input}
              value={height}
              onChangeText={val => setHeight(val)}
              keyboardType="decimal-pad"
            />

            <TextInput
              placeholder="Cân nặng (kg)"
              style={styles.modal_input}
              value={weight}
              onChangeText={val => setWeight(val)}
              keyboardType="decimal-pad"
            />

            <ButtonRE
              title={'Gửi'}
              onPress={handleSendBMI}
              buttonStyle={styles.modal_button}
              loading={loading}
            />
          </Modal>
        </Portal>

        <TouchableOpacity style={styles.btn_container} onPress={showModal}>
          <Text style={styles.btn_text}>{'Nhập BMI cho hôm nay'}</Text>
        </TouchableOpacity>
      </View>
    </>
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
    backgroundColor: '#007BFF',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007BFF',
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
    borderRadius: 8,
  },
});
export default BMIScreen;
