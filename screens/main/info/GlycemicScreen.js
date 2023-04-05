import moment from 'moment';
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import PureChart from 'react-native-pure-chart';
// import {LineChart} from 'react-native-chart-kit';
import {Button, Modal, Portal, TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {MESSAGE_MISS_DATA} from '../../../common/message';
import {TITLE_NOTIFICATION} from '../../../common/title';
import DropDownPicker from '../../../components/Input/DropdownPicker';
import {
  infoSelector,
  userGlycemicListSelectorFilter,
  userLastGlycemicSelector,
  userListGlycemicSelector,
} from '../../../redux/selectors/infoSelector';
import {infoSlice} from '../../../redux/slices/infoSlice';
import {postGlycemic} from '../../../services/patient/info';
import ICon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'react-native-gesture-handler';
import AnimatedLottieView from 'lottie-react-native';
import {socket} from '../../../utils/config';
import {Popup} from 'popup-ui';
import Header from '../../../components/Header';
import RouterKey from '../../../utils/Routerkey';
const optionItems = [
  {label: 'Trước bữa ăn', value: '1'},
  {label: 'Sau bữa ăn', value: '2'},
  {label: 'Trước khi ngủ', value: '3'},
  // {label: 'Xét nghiệm', value: '4'},
];

const optionDateItems = [
  {label: 'Tuần', value: 'week'},
  {label: 'Tháng', value: 'month'},
];

function GlycemicScreen({navigation}) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [glycemic, setGlycemic] = useState('');
  const [option, setOption] = useState('1');
  const [optionDate, setOptionDate] = useState('week');
  const glycemic_list = useSelector(userGlycemicListSelectorFilter);
  const glycemic_last = useSelector(userLastGlycemicSelector);
  const user_info = useSelector(infoSelector);

  useEffect(() => {
    dispatch(infoSlice.actions.updateOptionGlycemic(optionDate));
  }, [optionDate]);

  let glycemic_case_1 = 0;
  let glycemic_case_2 = 0;
  let glycemic_case_3 = 0;
  if (glycemic_last) {
    glycemic_case_1 = glycemic_last.find(item => item.case === 1)?.metric ?? 0;
    glycemic_case_2 = glycemic_last.find(item => item.case === 2)?.metric ?? 0;
    glycemic_case_3 = glycemic_last.find(item => item.case === 3)?.metric ?? 0;
  }
  useEffect(() => {
    dispatch(infoSlice.actions.updateOptionBMI(option));
  }, [option]);
  const metrics_1 = glycemic_list
    .filter(glycemic => glycemic.case === 1)
    .map(glycemic => {
      return {
        x: moment(glycemic.createdAt).format('l'),
        y: glycemic.metric,
      };
    });

  const metrics_2 = glycemic_list
    .filter(glycemic => glycemic.case === 2)
    .map(glycemic => {
      return {
        x: moment(glycemic.createdAt).format('l'),
        y: glycemic.metric,
      };
    });

  const metrics_3 = glycemic_list
    .filter(glycemic => glycemic.case === 3)
    .map(glycemic => {
      return {
        x: moment(glycemic.createdAt).format('l'),
        y: glycemic.metric,
      };
    });

  const data = [];
  if (metrics_1.length > 0) {
    data.push({
      seriesName: 'Trước ăn',
      data: metrics_1,
      color: '#227c9d',
    });
  }
  if (metrics_2.length > 0) {
    data.push({
      seriesName: 'Sau ăn',
      data: metrics_2,
      color: '#17c3b2',
    });
  }

  if (metrics_3.length > 0) {
    data.push({
      seriesName: 'Trước ngủ',
      data: metrics_3,
      color: '#ffcb77',
    });
  }

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handlePostGlycemic = () => {
    if (glycemic && glycemic > 0) {
      postGlycemic({
        metric: glycemic,
        case: option,
        patient: user_info._id,
      })
        .then(({data}) => {
          Popup.show({
            type: 'Success',
            title: 'Thông báo',
            button: true,
            textBody: `Chỉ số đường huyết đã được cập nhật`,
            buttontext: 'Nhập ngay',
            callback: () => {
              // navigation.navigate(RouterKey.ROUTER_INFO_SCREEN, {
              //   screen: RouterKey.INFO_SCREEN,
              // });
              Popup.hide();
            },
          });
          socket.emit('notification_register_schedule_from_patient', {
            data: data.notification,
          });
          dispatch(infoSlice.actions.addGlycemic(data.doc));
          setVisible(false);
          setGlycemic('');
          setOption('1');
        })
        .catch(error => {
          setVisible(false);
          Popup.show({
            type: 'Danger',
            title: 'Lỗi',
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
          // Alert.alert(TITLE_NOTIFICATION);
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
        title={'Chỉ số Đường Huyết'}
      />
      <View style={styles.container}>
        <View style={styles.bmi_container}>
          <View style={styles.bmi_text}>
            <Text style={styles.bmi_text_title}>
              {`Chỉ số đường huyết mới nhất: \n${moment(
                glycemic_last.length > 0
                  ? glycemic_last[0].createdAt
                  : new Date(),
              ).fromNow()}`}
            </Text>
            <Text style={styles.bmi_text_notification}>
              {`Đường huyết trước khi ăn: ${glycemic_case_1}/600\n`}
              {`Đường huyết trước sau ăn: ${glycemic_case_2}/600\n`}
              {`Đường huyết trước trước ngủ: ${glycemic_case_3}/600\n`}
            </Text>
          </View>
          <AnimatedLottieView
            source={require('../../../assets/images/blood.json')}
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
              height={320}
              // customValueRenderer={(index, point) => {
              //   return <Text style={{textAlign: 'center'}}>{point.y}</Text>;
              // }}
            />
          )}
        </View>
        <View style={styles.bottom_view}>
          <View
            style={{backgroundColor: '#227c9d', padding: 4, borderRadius: 8}}>
            <Text>Trước ăn</Text>
          </View>
          <View
            style={{backgroundColor: '#17c3b2', padding: 4, borderRadius: 8}}>
            <Text>Sau ăn</Text>
          </View>
          <View
            style={{backgroundColor: '#ffcb77', padding: 4, borderRadius: 8}}>
            <Text>Trước ngủ</Text>
          </View>
        </View>

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

            <Button
              mode="elevated"
              onPress={handlePostGlycemic}
              style={styles.modal_button}>
              Gửi
            </Button>
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
  },
  bottom_view: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default GlycemicScreen;
