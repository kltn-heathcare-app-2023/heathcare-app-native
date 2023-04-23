import {useEffect, useRef, useState, useCallback} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import {ActivityIndicator, TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import MessageItem from '../../../../components/MessageItem';
import {
  messageDoctorListByConversationSelector,
  messageListByConversationSelector,
} from '../../../../redux/selectors/messageSelector';
import {
  fetchMessagesByIdConversation,
  messageSlice,
} from '../../../../redux/slices/messageSlice';
import {postMessage} from '../../../../services/patient/conversation';
import ICon from 'react-native-vector-icons/Ionicons';
import {socket} from '../../../../utils/config';
import RouterKey from '../../../../utils/Routerkey';
import {doctorProfileSelector} from '../../../../redux/selectors/doctor/infoSelector';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {doctorConversationSlice} from '../../../../redux/slices/doctor/doctorConversationSlice';

const keyboardVerticalOffset = Platform.OS === 'ios' ? 85 : -300;

function DoctorConversationDetail({route, navigation}) {
  const {conversation} = route.params;

  const dispatch = useDispatch();
  const doctor_profile = useSelector(doctorProfileSelector);
  const messages = useSelector(messageDoctorListByConversationSelector);
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [size, setSize] = useState(10);
  const scrollViewRef = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.emit('join_room', conversation);
    dispatch(fetchMessagesByIdConversation(conversation._id));
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [conversation._id]);

  useEffect(() => {
    socket.on('receiver_message', ({message}) => {
      // console.log('message ->', message);
      dispatch(messageSlice.actions.pushMessage(message));
    });
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      if (size < messages.length && messages.length - size > 10) {
        setSize(prev => prev + 10);
      } else {
        const last_size = messages.length - size;
        setSize(prev => prev + last_size);
      }
    }, 200);
  }, [size]);

  // socket when send message
  const handleSendMessage = async () => {
    if (message) {
      const data = {
        conversation: conversation._id,
        senderId: doctor_profile.doctor._id,
        content: message,
      };

      const formData = new FormData();
      formData.append('conversation', conversation._id);
      formData.append('senderId', doctor_profile.doctor._id);
      formData.append('content', message);
      images.forEach(image => {
        formData.append('image', image);
      });
      try {
        const resp = await postMessage(formData);
        socket.emit('send_message', {message: resp.data});
        dispatch(messageSlice.actions.pushMessage(resp.data));
        dispatch(doctorConversationSlice.actions.updateLastMessage(resp.data));
        setMessage('');
        setImages([]);
      } catch (error) {
        console.log('error handle send message ->', error);
      }
    }
  };

  const handleChooseImage = async () => {
    try {
      const _images = await MultipleImagePicker.openPicker({
        mediaType: 'image',
      });
      const __images = _images.map(image => {
        return {
          uri: `file://${image.realPath}`,
          type: image.mime,
          name: image.fileName,
        };
      });
      setImages(__images);
    } catch (error) {
      console.log('err chooose image -> ', error);
    }
    Date;
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{flex: 1}}
        keyboardVerticalOffset={keyboardVerticalOffset}
        behavior={'padding'}>
        <View style={styles.header}>
          <View style={styles.header_left}>
            <ICon
              name={'arrow-back'}
              color="black"
              size={20}
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.header_left_username}>
              {`BN. ${conversation.member.username}`}
            </Text>
          </View>

          <ICon
            name={'videocam-outline'}
            color="black"
            size={20}
            onPress={() => {
              socket.emit('call_id_room_to_user', {
                conversation,
                infoDoctor: doctor_profile.doctor,
              });
              navigation.navigate(RouterKey.CALL_VIDEO_SCREEN, {
                room_id: conversation._id,
              });
            }}
          />
        </View>
        {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
        keyboardVerticalOffset={keyboardVerticalOffset}></KeyboardAvoidingView> */}
        {loading ? (
          <View
            style={[
              styles.content,
              {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}>
            <ActivityIndicator
              animating={true}
              color={'#8ecae6'}
              style={{marginTop: 16}}
              size={'large'}
            />
          </View>
        ) : (
          <ScrollView
            style={styles.content}
            ref={scrollViewRef}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onContentSizeChange={() => {
              if (size === 10) {
                scrollViewRef.current.scrollToEnd({animated: true});
              }
            }}>
            {messages
              // .reverse()
              .slice(
                messages.length < 10
                  ? -messages.length
                  : messages.length - size,
                messages.length,
              )
              .map(message => {
                // console.log(message);
                return <MessageItem message={message} key={message._id} />;
              })}
          </ScrollView>
        )}
        <TextInput
          right={
            message ? (
              <TextInput.Icon
                icon={'send-circle-outline'}
                size={32}
                style={{
                  marginLeft: 16,
                }}
                onPress={handleSendMessage}
              />
            ) : (
              <TextInput.Icon
                icon={'camera-outline'}
                size={32}
                style={{
                  marginLeft: 16,
                }}
                onPress={handleChooseImage}
              />
            )
          }
          style={{
            backgroundColor: '#fff',
            borderWidth: 1,
            height: 48,
            borderColor: '#cccc',
          }}
          value={message}
          onChangeText={val => setMessage(val)}
          mode={'flat'}
        />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#B4E4FF',
    minHeight: '8%',
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  header_left: {
    width: '70%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  header_left_username: {
    marginLeft: 16,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 8,
    height: '84%',
    backgroundColor: '#fff',
  },
  message_box: {
    width: '100%',
    height: 'auto',
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    //isMe
    // flexDirection: "row-reverse",
    // alignItems: "center",
    // justifyContent: "flex-end",
    // marginRight: "20%",
  },
  message_text: {
    width: '70%',
    minHeight: 70,
    height: 'auto',
    backgroundColor: '#caf0f8',
    borderRadius: 16,
    padding: 8,
    margin: 2,
  },
});

export default DoctorConversationDetail;
