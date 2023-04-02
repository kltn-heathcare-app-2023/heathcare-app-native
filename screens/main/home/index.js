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
  userLastGlycemicSelector,
} from '../../../redux/selectors/infoSelector';
import ScheduleItem from '../../../components/ScheduleItem';
import {ProgressChart} from 'react-native-chart-kit';
import {fetchAllScheduleDetailListById} from '../../../redux/slices/scheduleDetailSlice';
import {scheduleDetailListAfterNow} from '../../../redux/selectors/scheduleDetailSelector';
import {socket} from '../../../utils/config';
import {Button} from 'react-native-paper';
import RouterKey from '../../../utils/Routerkey';
import AnimatedLottieView from 'lottie-react-native';

function HomeScreen({navigation}) {
  const user_info = useSelector(infoSelector);
  const bmi_avg = useSelector(userAVGBMISelector);
  const glycemic_last = useSelector(userLastGlycemicSelector);
  const status = useSelector(infoStatusSelector);

  // console.log({user_info, bmi_avg, glycemic_last, status});
  let glycemic_case_1 = 0;
  let glycemic_case_2 = 0;
  let glycemic_case_3 = 0;
  if (glycemic_last) {
    glycemic_case_1 = glycemic_last.find(item => item.case === 1)?.metric ?? 0;
    glycemic_case_2 = glycemic_last.find(item => item.case === 2)?.metric ?? 0;
    glycemic_case_3 = glycemic_last.find(item => item.case === 3)?.metric ?? 0;
  }

  const dispatch = useDispatch();
  const schedules = useSelector(scheduleDetailListAfterNow);

  const data = {
    // labels: ["", "", "BMI"], // optional
    data: [0, 0, bmi_avg / 30],
  };

  const dataGlycemic = {
    data: [glycemic_case_1 / 600, glycemic_case_2 / 600, glycemic_case_3 / 600],
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

  useEffect(() => {
    if (user_info?._id) {
      dispatch(fetchAllScheduleDetailListById(user_info._id));
    }
  }, [user_info]);

  useEffect(() => {
    socket.on('call_id_room_to_user_success', resp => {
      const {room_id, doctor_username} = resp;
      console.log('call ->', room_id, doctor_username);
    });

    socket.on('test', resp => {
      console.log('call ->', resp);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.box_chart}>
        <View style={styles.chart}>
          <ProgressChart
            data={data}
            width={146}
            height={146}
            strokeWidth={12}
            radius={32}
            chartConfig={chartBMIConfig}
            hideLegend={true}
            style={{borderRadius: 16}}
          />
          <Text style={styles.chart_text}>{`Chỉ số BMI: ${bmi_avg}/ 30`}</Text>
        </View>

        <View style={styles.chart}>
          <ProgressChart
            data={dataGlycemic}
            width={146}
            height={146}
            strokeWidth={12}
            radius={32}
            chartConfig={chartGlycemicConfig}
            hideLegend={true}
            style={{borderRadius: 16}}
          />
          <Text
            style={
              styles.chart_text
            }>{`Chỉ số TH1: ${glycemic_case_1}/ 600\nChỉ số TH2: ${glycemic_case_2}/ 600\nChỉ số TH3: ${glycemic_case_3}/ 600`}</Text>
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
            navigation.navigate(RouterKey.UTILS_CHAT_GPT_SCREEN);
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
      <ScrollView style={styles.box_schedule}>
        {schedules.map(schedule => (
          <ScheduleItem
            schedule={schedule}
            isHome
            key={schedule._id}
            userId={user_info?._id}
          />
        ))}
      </ScrollView>
    </View>
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
});

export default HomeScreen;
