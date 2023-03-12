import {useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import MessageItem from '../../../../components/MessageItem';
import {infoSelector} from '../../../../redux/selectors/infoSelector';
import {messageListByConversationSelector} from '../../../../redux/selectors/messageSelector';
import {
  fetchMessagesByIdConversation,
  messageSlice,
} from '../../../../redux/slices/messageSlice';
import {postMessage} from '../../../../services/patient/conversation';
import ICon from 'react-native-vector-icons/Ionicons';
import {socket} from '../../../../utils/config';
import RouterKey from '../../../../utils/Routerkey';

const keyboardVerticalOffset = Platform.OS === 'ios' ? 85 : -90;

function ConversationDetail({route, navigation}) {
  const {conversation} = route.params;
  const dispatch = useDispatch();
  const user = useSelector(infoSelector);
  const messages = useSelector(messageListByConversationSelector);

  const [message, setMessage] = useState('');

  const scrollViewRef = useRef();

  useEffect(() => {
    socket.emit('join_room', conversation._id);

    dispatch(fetchMessagesByIdConversation(conversation._id));
  }, []);

  const handleSendMessage = async () => {
    if (message) {
      const data = {
        conversation: conversation._id,
        senderId: user._id,
        content: message,
      };

      try {
        const resp = await postMessage(data);
        socket.emit('send_message', {message: resp.data});
        dispatch(messageSlice.actions.pushMessage(resp.data));
        setMessage('');
      } catch (error) {
        console.log('error handle send message ->', error);
      }
    }
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.header_left}>
          <ICon
            name={'arrow-back'}
            color="black"
            size={20}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.header_left_username}>
            {`BS. ${conversation.member.username}`}
          </Text>
        </View>

        <ICon
          name={'videocam-outline'}
          color="black"
          size={20}
          onPress={() => navigation.navigate(RouterKey.CALL_VIDEO_SCREEN)}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <ScrollView
          style={styles.content}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({animated: true})
          }>
          {messages.map(message => {
            // console.log(message);
            return <MessageItem message={message} key={message._id} />;
          })}
        </ScrollView>

        <TextInput
          right={
            <TextInput.Icon
              icon={'send-circle-outline'}
              size={32}
              style={{
                marginLeft: 16,
              }}
              onPress={handleSendMessage}
            />
          }
          style={{
            backgroundColor: '#fff',
            borderWidth: 1,
            height: 48,
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
    width: '50%',
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
    height: '83%',
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

export default ConversationDetail;
