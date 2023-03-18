// import DatePicker from 'react-native-datepicker';
import DatePicker from 'react-native-neat-date-picker';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import FIcon from 'react-native-vector-icons/Fontisto';

function DateTimePicker({date, setDate}) {
  const [showDatePicker, setShowDatePicker] = useState(true);

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const onCancel = () => {
    // You should close the modal in here
    setShowDatePicker(false);
  };

  const onConfirm = date => {
    // You should close the modal in here
    setShowDatePicker(false);

    // The parameter 'date' is a Date object so that you can use any Date prototype method.
    setDate(date);
  };

  return (
    <View style={styles.container}>
      <FIcon name="date" size={24} />

      <DatePicker
        isVisible={showDatePicker}
        mode={'single'}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#5D90F5',
    height: 50,
    width: '90%',
    margin: 5,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  picker: {
    marginRight: 4,
  },
});
export default DateTimePicker;
