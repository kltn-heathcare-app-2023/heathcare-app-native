import moment from 'moment';
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {View, Text, StyleSheet} from 'react-native';
import PureChart from 'react-native-pure-chart';
// import {LineChart} from 'react-native-chart-kit';
import {Button, Modal, Portal, TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {MESSAGE_MISS_DATA} from '../../../common/message';
import {TITLE_NOTIFICATION} from '../../../common/title';
import DropDownPicker from '../../../components/Input/DropdownPicker';
import {
  infoSelector,
  userBloodPressureListSelectorFilter,
  userLastBloodPressureSelector,
} from '../../../redux/selectors/infoSelector';
import {infoSlice} from '../../../redux/slices/infoSlice';
import {postBloodPressure, postGlycemic} from '../../../services/patient/info';
import ICon from 'react-native-vector-icons/MaterialCommunityIcons';

import AnimatedLottieView from 'lottie-react-native';
import {socket} from '../../../utils/config';
import {Popup} from 'popup-ui';
import Header from '../../../components/Header';
import RouterKey from '../../../utils/Routerkey';

import {Button as ButtonRE} from 'react-native-elements';

const optionDateItems = [
  {label: 'Tuần', value: 'week'},
  {label: 'Tháng', value: 'month'},
];

function BloodScreen({navigation}) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [diastoleMetric, setDiastoleMetric] = useState('');
  const [systolicMetric, setSystolicMetric] = useState('');
  const [optionDate, setOptionDate] = useState('week');
  const [loading, setLoading] = useState(false);

  const blood_list = useSelector(userBloodPressureListSelectorFilter);
  const last_blood_pressure = useSelector(userLastBloodPressureSelector);
  const {
    diastole = null,
    systolic = null,
    createdAt = null,
  } = last_blood_pressure;
  const user_info = useSelector(infoSelector);

  useEffect(() => {
    dispatch(infoSlice.actions.updateOptionBlood(optionDate));
  }, [optionDate]);

  const metrics_1 = blood_list.map(blood => {
    return {
      x: moment(blood.createdAt).format('l'),
      y: blood.systolic,
    };
  });

  const metrics_2 = blood_list.map(blood => {
    return {
      x: moment(blood.createdAt).format('l'),
      y: blood.diastole,
    };
  });

  const data = [];

  if (metrics_1.length > 0) {
    data.push({
      seriesName: 'Tâm thu',
      data: metrics_1,
      color: '#e76f51',
    });
  }
  if (metrics_2.length > 0) {
    data.push({
      seriesName: 'Tâm trương',
      data: metrics_2,
      color: '#d00000',
    });
  }

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handlePostBloodPressure = () => {
    if (
      diastoleMetric &&
      diastoleMetric > 0 &&
      systolicMetric &&
      systolicMetric > 0
    ) {
      setLoading(true);
      postBloodPressure({
        systolic: systolicMetric,
        diastole: diastoleMetric,
        patient: user_info._id,
      })
        .then(({data}) => {
          console.log(data);
          Popup.show({
            type: 'Success',
            title: 'Thông báo',
            button: true,
            textBody: `Chỉ số  huyết áp đã được cập nhật`,
            buttontext: 'Nhập ngay',
            callback: () => {
              // navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
              //   screen: RouterKey.INFO_SCREEN,
              // });
              Popup.hide();
            },
          });
          socket.emit('notification_register_schedule_from_patient', {
            data: {notification: data.notification},
          });
          dispatch(infoSlice.actions.addBlood(data.doc));
          setDiastoleMetric('');
          setSystolicMetric('');
        })
        .catch(error => {
          Popup.show({
            type: 'Danger',
            title: 'Chú ý',
            button: true,
            textBody: `${error.message}`,
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
          setVisible(false);
          setLoading(false);
        });
    } else {
      setVisible(false);
      Popup.show({
        type: 'Warning',
        title: 'Chú ý',
        button: true,
        textBody: MESSAGE_MISS_DATA,
        buttontext: 'OK',
        callback: () => {
          // navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
          //   screen: RouterKey.INFO_SCREEN,
          // });
          Popup.hide();
        },
      });
    }
  };

  return (
    <>
      <Header
        handle={() => navigation.navigate(RouterKey.INFO_SCREEN)}
        title={'Chỉ số huyết áp'}
      />
      <View style={styles.container}>
        <View style={styles.bmi_container}>
          <View style={styles.bmi_text}>
            <Text style={styles.bmi_text_title}>
              {`Chỉ số Huyết áp mới nhất: \n${moment(
                last_blood_pressure ? createdAt : new Date(),
              ).fromNow()}`}
            </Text>
            <Text style={styles.bmi_text_notification}>
              {`Tâm thu: ${systolic}\n`}
              {`Tâm trương: ${diastole}\n`}
            </Text>
          </View>

          <AnimatedLottieView
            source={require('../../../assets/images/heart.json')}
            autoPlay
            loop
            style={{
              marginLeft: 135,
            }}
          />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 4,
            zIndex: 1,
          }}>
          <DropDownPicker
            items={optionDateItems}
            _setValue={setOptionDate}
            value={optionDate}
            style={{
              width: '80%',
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
          <ICon
            name={'plus-circle-outline'}
            size={32}
            onPress={showModal}
            color={'#02c39a'}
          />
        </View>
        <View style={{marginTop: 12}}>
          {data.length > 0 && (
            <PureChart
              data={data}
              type="line"
              height={350}
              // customValueRenderer={(index, point) => {
              //   return <Text style={{textAlign: 'center'}}>{point.y}</Text>;
              // }}
            />
          )}
        </View>
        <View style={styles.bottom_view}>
          <View
            style={{
              backgroundColor: '#e76f51',
              padding: 4,
              borderRadius: 8,
            }}>
            <Text style={{fontWeight: '600', color: '#fff'}}>Tâm thu</Text>
          </View>
          <View
            style={{backgroundColor: '#d00000', padding: 4, borderRadius: 8}}>
            <Text style={{fontWeight: '600', color: '#fff'}}>Tâm trương</Text>
          </View>
        </View>

        <Portal>
          <Modal
            visible={visible}
            auto
            onDismiss={hideModal}
            contentContainerStyle={styles.modal}>
            <Text>Chỉ số huyết áp hôm nay</Text>

            <TextInput
              placeholder="Tâm thu (mmHG)"
              style={styles.modal_input}
              value={systolicMetric}
              onChangeText={val => setSystolicMetric(val)}
              keyboardType="decimal-pad"
            />

            <TextInput
              placeholder="Tâm trương (mmHG)"
              style={styles.modal_input}
              value={diastoleMetric}
              onChangeText={val => setDiastoleMetric(val)}
              keyboardType="decimal-pad"
            />

            <ButtonRE
              title={'Gửi'}
              onPress={handlePostBloodPressure}
              buttonStyle={styles.modal_button}
              loading={loading}
            />
          </Modal>
        </Portal>
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
    borderRadius: 8,
  },
  bottom_view: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
});

export default BloodScreen;
