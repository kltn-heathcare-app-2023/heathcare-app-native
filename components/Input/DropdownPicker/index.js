import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Picker from 'react-native-dropdown-picker';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MTICon from 'react-native-vector-icons/MaterialCommunityIcons';
function DropDownPicker({
  value,
  _setValue,
  items,
  isGender,
  isBlood,
  style,
  stylePicker,
  childPicker,
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {isGender && <FAIcon name="transgender" size={24} color="gray" />}
      {isBlood && <MTICon name="water-plus" size={24} color="gray" />}
      <Picker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={_setValue}
        placeholder={value}
        style={[styles.picker, stylePicker]}
        dropDownContainerStyle={[styles.childPicker, childPicker]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#5D90F5',
    height: 55,
    width: '90%',
    margin: 5,
    paddingLeft: 10,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  picker: {
    borderWidth: 0,
    width: '94%',
  },
  childPicker: {
    marginRight: '20%',
    borderColor: '#5D90F5',
  },
});
export default DropDownPicker;
