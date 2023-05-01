import {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  infoSelector,
  infoStatusSelector,
  userAVGBMISelector,
  userLastBloodPressureSelector,
  userLastGlycemicSelector,
  userListBloodPressureSelector,
} from '../../../redux/selectors/infoSelector';
import ScheduleItem from '../../../components/ScheduleItem';
import {ProgressChart} from 'react-native-chart-kit';
import {
  fetchAllScheduleDetailListById,
  removeScheduleDetail,
} from '../../../redux/slices/scheduleDetailSlice';
import {scheduleDetailListAfterNow} from '../../../redux/selectors/scheduleDetailSelector';
import {socket} from '../../../utils/config';
import {Modal, Portal} from 'react-native-paper';
import RouterKey from '../../../utils/Routerkey';
import AnimatedLottieView from 'lottie-react-native';
import {Rating, AirbnbRating, Input, Button} from 'react-native-elements';
import {ratingAfterExam} from '../../../services/patient/schedule_detail';

function HomeScreen({navigation, route}) {
  const status = useSelector(infoStatusSelector);
  const dispatch = useDispatch();
  const {rating, room_id, schedule_detail_id, doctor_id} = route.params ?? {
    rating: false,
  };
  // console.log(route);
  const [visible, setVisible] = useState(rating);
  const [countRating, setCountRating] = useState(5);
  const [contentRating, setContentRating] = useState('');

  const user_info = useSelector(infoSelector);
  const bmi_avg = useSelector(userAVGBMISelector);
  const glycemic_last = useSelector(userLastGlycemicSelector);
  const schedules = useSelector(scheduleDetailListAfterNow);
  const last_blood = useSelector(userLastBloodPressureSelector);

  let glycemic_case_1 = 0;
  let glycemic_case_2 = 0;
  let glycemic_case_3 = 0;
  if (glycemic_last) {
    glycemic_case_1 = glycemic_last.find(item => item.case === 1)?.metric ?? 0;
    glycemic_case_2 = glycemic_last.find(item => item.case === 2)?.metric ?? 0;
    glycemic_case_3 = glycemic_last.find(item => item.case === 3)?.metric ?? 0;
  }

  let systolic = 0;
  let diastole = 0;
  if (last_blood) {
    systolic = last_blood.systolic;
    diastole = last_blood.diastole;
  }

  const data = {
    // labels: ["", "", "BMI"], // optional
    data: [
      (systolic > 120 ? 120 : systolic) / 120,
      (diastole > 180 ? 180 : diastole) / 180,
      bmi_avg > 30 ? 30 : bmi_avg / 30,
    ],
  };

  const dataGlycemic = {
    data: [
      (glycemic_case_1 > 132 ? 132 : glycemic_case_1) / 132,
      (glycemic_case_2 > 180 ? 180 : glycemic_case_2) / 180,
      (glycemic_case_3 > 120 ? 120 : glycemic_case_3) / 120,
    ],
  };

  const chartBMIConfig = {
    backgroundGradientFrom: '#2a9d8f',
    backgroundGradientFromOpacity: 0.5,
    backgroundGradientTo: '#06d6a0',
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(25, 256, 148, ${opacity})`,
    // strokeWidth: 4, // optional, default 3
    barPercentage: 0.5,
    // useShadowColorFromDataset: false, // optional
  };

  const chartGlycemicConfig = {
    backgroundGradientFrom: '#f8edeb',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#ffb5a7',
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(244, 115, 115, ${opacity})`,
    // strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    // useShadowColorFromDataset: false, // optional
  };

  // useEffect(() => {
  //   if (user_info?._id) {

  //   }
  // }, [user_info]);

  useEffect(() => {
    socket.on('call_id_room_to_user_success', resp => {
      const {room_id, doctor_username} = resp;
      console.log('call ->', room_id, doctor_username);
    });

    socket.on('test', resp => {
      console.log('call ->', resp);
    });
  }, []);

  useEffect(() => {
    if (schedule_detail_id) {
      setVisible(rating);
    }
  }, [rating, route.params]);

  const hideModal = () => setVisible(false);

  const handleSendRating = () => {
    if (user_info) {
      const data = {
        rating: countRating,
        patient_id: user_info._id,
        content: contentRating,
        schedule_id: schedule_detail_id,
      };

      ratingAfterExam(doctor_id, data)
        .then(value => {
          dispatch(removeScheduleDetail(schedule_detail_id));
        })
        .catch(err => console.error(err))
        .finally(() => {
          setCountRating(5);
          setContentRating('');
          setVisible(false);
        });
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.box_chart}>
          <View style={styles.chart}>
            <ProgressChart
              data={data}
              width={160}
              height={160}
              strokeWidth={12}
              radius={32}
              chartConfig={chartBMIConfig}
              hideLegend={true}
              style={{borderRadius: 16}}
            />
            <Text
              style={styles.chart_text}>{`Chỉ số BMI: ${bmi_avg}/ 30`}</Text>
            <Text
              style={
                styles.chart_text
              }>{`HA - Tâm thu: ${systolic}/ 120`}</Text>
            <Text
              style={
                styles.chart_text
              }>{`HA - Tâm trương: ${diastole}/ 180`}</Text>
          </View>

          <View style={styles.chart}>
            <ProgressChart
              data={dataGlycemic}
              width={160}
              height={160}
              strokeWidth={12}
              radius={32}
              chartConfig={chartGlycemicConfig}
              hideLegend={true}
              style={{borderRadius: 16}}
            />
            <Text
              style={
                styles.chart_text
              }>{`Chỉ số TH1: ${glycemic_case_1}/ 126\nChỉ số TH2: ${glycemic_case_2}/ 180\nChỉ số TH3: ${glycemic_case_3}/ 120`}</Text>
          </View>
        </View>
        {status && status.message && (
          <View
            style={[
              styles.box_status,
              {
                borderColor:
                  status && status.message.code === 0
                    ? '#0ead69'
                    : status.message.code === 1
                    ? '#fb8b240'
                    : status.message.code === 2
                    ? '#f95738'
                    : '#cbdfbd',
              },
              {marginTop: 8},
            ]}>
            <Text style={styles.box_status_title}>Đánh giá:</Text>
            <Text style={styles.box_status_content}>
              {status ? status?.message?.status : 'Đang tải ...'}
            </Text>
          </View>
        )}

        <View style={{display: 'flex', flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(RouterKey.UTILS_CHAT_GPT_SCREEN);
            }}
            style={{
              marginTop: 4,
              padding: 4,
              borderWidth: 2,
              width: 72,
              height: 'auto',
              borderRadius: 16,
              borderColor: '#06d6a0',
            }}>
            <AnimatedLottieView
              source={require('../../../assets/images/bot.json')}
              autoPlay
              loop
              style={{
                width: 64,
                height: 64,
              }}
            />
            {/* <Text style={{textAlign: 'center'}}>Chat Bot</Text> */}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate(RouterKey.UTILS_POST_LIST_SCREEN);
            }}
            style={{
              marginTop: 4,
              marginLeft: 8,
              padding: 4,
              borderWidth: 2,
              width: 72,
              height: 'auto',
              borderRadius: 16,
              borderColor: '#4cc9f0',
            }}>
            <AnimatedLottieView
              source={require('../../../assets/images/post.json')}
              autoPlay
              loop
              style={{
                width: 64,
                height: 64,
              }}
            />
            {/* <Text style={{textAlign: 'center'}}>Cộng đồng</Text> */}
          </TouchableOpacity>
        </View>
        <Text style={styles.schedule_text}>Lịch khám của bạn</Text>
        {schedules.length > 0 ? (
          <ScrollView style={styles.box_schedule}>
            {schedules.map(schedule => (
              <ScheduleItem
                schedule={schedule}
                isHome
                key={schedule._id}
                userId={user_info?._id}
                navigation={navigation}
              />
            ))}
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>{'Bạn chưa có lịch khám nào'}</Text>
          </View>
        )}
      </View>

      <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
          <View style={styles.modal_container}>
            <Rating
              showRating
              onFinishRating={rating => {
                console.log('rating ->', rating);
                setCountRating(rating);
              }}
              style={{paddingVertical: 10}}
              imageSize={30}
              startingValue={countRating}
            />
            <Input
              placeholder="Nhập đánh giá bác sĩ"
              value={contentRating}
              onChangeText={v => setContentRating(v)}
            />
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Button
                title={'Gửi'}
                type="solid"
                buttonStyle={{width: 164, borderRadius: 16}}
                onPress={handleSendRating}
              />
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 'auto',
    paddingHorizontal: 8,
    flex: 1,
    backgroundColor: '#fff',
  },
  box_chart: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chart: {
    padding: 8,
    // borderWidth: 2,
    // borderColor: "#006d77",
    borderRadius: 16,
  },
  chart_text: {
    textAlign: 'left',
  },
  box_schedule: {
    height: '65%',
    marginTop: 16,
  },
  schedule_text: {
    margin: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  box_status: {
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
    position: 'relative',
    marginBottom: 8,
  },
  box_status_title: {
    position: 'absolute',
    top: -12,
    left: 8,
    zIndex: 1,
    backgroundColor: '#fff',
    fontWeight: '700',
  },
  box_status_content: {
    fontSize: 16,
    fontWeight: '700',
  },
  modal_container: {
    width: '90%',
    height: 264,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
  },
});

export default HomeScreen;
