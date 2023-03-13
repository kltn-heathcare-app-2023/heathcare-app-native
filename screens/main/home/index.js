import {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  infoSelector,
  userAVGBMISelector,
  userLastGlycemicSelector,
} from '../../../redux/selectors/infoSelector';
import ScheduleItem from '../../../components/ScheduleItem';
import {ProgressChart} from 'react-native-chart-kit';
import {fetchAllScheduleDetailListById} from '../../../redux/slices/scheduleDetailSlice';
import {
  scheduleDetailList,
  scheduleDetailListAfterNow,
} from '../../../redux/selectors/scheduleDetailSelector';
import {socket} from '../../../utils/config';

function HomeScreen() {
  const user_info = useSelector(infoSelector);
  const bmi_avg = useSelector(userAVGBMISelector);
  const glycemic_last = useSelector(userLastGlycemicSelector);

  const dispatch = useDispatch();
  const schedules = useSelector(scheduleDetailListAfterNow);

  const data = {
    // labels: ["", "", "BMI"], // optional
    data: [0, 0, bmi_avg / 30],
  };

  const dataGlycemic = {
    data: [0, 0, glycemic_last / 600],
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

  return (
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
          <Text style={styles.chart_text}>{`Chỉ số BMI: ${bmi_avg}/ 30`}</Text>
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
            }>{`Chỉ số ĐH: ${glycemic_last}/ 600`}</Text>
        </View>
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
  },
  box_chart: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  chart: {
    padding: 8,
    // borderWidth: 2,
    // borderColor: "#006d77",
    borderRadius: 16,
  },
  chart_text: {
    textAlign: 'center',
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
});

export default HomeScreen;
