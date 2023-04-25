import {DoctorHomeStackNavigator} from '../../../routers/doctor/DoctorNavigator';
import {useEffect} from 'react';
import {socket} from '../../../utils/config';
import {useNotification} from 'react-native-internal-notification';
import Icon from 'react-native-vector-icons/Ionicons';
import RouterKey from '../../../utils/Routerkey';

function DoctorHomeScreen() {
  // const notificationFromSocket = useNotification();
  // useEffect(() => {
  //   socket.on('receiver_message', ({message}) => {
  //     console.log(message);
  //     notificationFromSocket.showNotification({
  //       title: 'Tin nhắn',
  //       message:
  //         message.images.length > 0 ? 'Tin nhắn hình ảnh' : message.content,
  //       icon: <Icon name={'ios-chatbubble-ellipses-outline'} size={24} />,
  //       color: '#fff',
  //       onPress: () => navigation.navigate(RouterKey.MESSAGE_SCREEN),
  //       showingTime: 5000,
  //     });
  //   });
  // }, []);
  return <DoctorHomeStackNavigator />;
}

export default DoctorHomeScreen;
