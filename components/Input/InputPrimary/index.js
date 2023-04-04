import {forwardRef, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FIcon from 'react-native-vector-icons/Ionicons';
import FMIcon from 'react-native-vector-icons/MaterialCommunityIcons';

function TextInputPrimary({
  value,
  onChangeText,
  placeholder,
  isPass,
  isPhone,
  isName,
  isAddress,
  isInsurance,
  isDate,
  editable,
  selectTextOnFocus,
  openPicker,
  style,
  error,
}) {
  const [isPassState, setIsPassState] = useState(isPass);
  const [nameIcon, setNameIcon] = useState('eye-off-outline');

  const handleClickIcon = () => {
    setIsPassState(!isPassState);
    nameIcon == 'eye-outline'
      ? setNameIcon('eye-off-outline')
      : setNameIcon('eye-outline');
  };

  return (
    <>
      <View
        style={[
          styles.container,
          style,
          {borderColor: error ? '#e76f51' : '#5D90F5'},
        ]}>
        {isPhone && <FAIcon name="phone" size={24} color="gray" />}
        {isPass && <FAIcon name="lock" size={24} color="gray" />}
        {isName && <FAIcon name="user" size={24} color="gray" />}
        {isAddress && <FIcon name="location-sharp" size={24} color="gray" />}
        {isInsurance && (
          <FMIcon name="text-box-plus-outline" size={24} color="gray" />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.textInput]}
          placeholder={placeholder}
          secureTextEntry={isPassState}
          keyboardType={isPhone ? 'phone-pad' : 'default'}
          editable={editable}
          selectTextOnFocus={selectTextOnFocus}
        />

        {isPass && (
          <Icon
            name={nameIcon}
            color="#000"
            size={20}
            onPress={() => handleClickIcon()}
          />
        )}

        {isDate && (
          <Icon name={'calendar'} color="#000" size={20} onPress={openPicker} />
        )}
      </View>
      {error && <Text style={styles.text_error}>{error}</Text>}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
  textInput: {
    paddingLeft: 10,
    height: 40,
    fontSize: 16,
    width: '85%',
  },
  text_error: {
    color: '#e76f51',
    fontWeight: '700',
    textAlign: 'left',
  },
});

export default TextInputPrimary;
