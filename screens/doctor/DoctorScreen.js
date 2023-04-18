import {useEffect} from 'react';
import DoctorNavigator from '../../routers/doctor/DoctorNavigator';
import {socket} from '../../utils/config';

import {useNotification} from 'react-native-internal-notification';
import IIcon from 'react-native-vector-icons/Ionicons';
import RouterKey from '../../utils/Routerkey';
import {useDispatch} from 'react-redux';
import {notificationSlice} from '../../redux/slices/notificationSlice';

function DoctorScreen({navigation}) {
  const notificationFromSocket = useNotification();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('notification_register_schedule_from_patient_success', resp => {
      const {notification, schedule_detail} = resp;
      if (notification) {
        dispatch(notificationSlice.actions.pushNotification(notification));
        notificationFromSocket.showNotification({
          title: 'Thông báo',
          message: notification.content,
          icon: <IIcon name={'notifications-outline'} size={24} />,
          color: '#fff',
          onPress: () =>
            navigation.navigate(RouterKey.DOCTOR_NOTIFICATION_SCREEN),
          showingTime: 5000,
        });
      }
    });
  }, []);
  return <DoctorNavigator />;
}

export default DoctorScreen;
