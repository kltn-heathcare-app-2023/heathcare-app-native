import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function Header({handle, title}) {
  return (
    <View
      style={{
        height: 54,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 8,
      }}>
      <TouchableOpacity onPress={handle}>
        <Icon name={'md-chevron-back'} size={32} />
      </TouchableOpacity>
      <Text style={{fontSize: 16, marginLeft: 8, fontWeight: '600'}}>
        {title}
      </Text>
    </View>
  );
}

export default Header;
