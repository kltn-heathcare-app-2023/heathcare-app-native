import {useRef, useState} from 'react';
import {ScrollView} from 'react-native';
import {KeyboardAvoidingView} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import ICon from 'react-native-vector-icons/Ionicons';
import MessageItem from '../../components/MessageItem';
import env from '../../utils/env';
import {useSelector} from 'react-redux';
import {infoSelector} from '../../redux/selectors/infoSelector';

const keyboardVerticalOffset = Platform.OS === 'ios' ? 85 : -250;

function ChatGPTScreen({navigation}) {
  const scrollViewRef = useRef();
  const user_info = useSelector(infoSelector);
  const [messages, setMessages] = useState([
    {
      sender: {
        username: 'AI',
        avatar:
          'https://media.istockphoto.com/id/1073076312/vi/vec-to/robot-m%E1%BB%89m-c%C6%B0%E1%BB%9Di-d%E1%BB%85-th%C6%B0%C6%A1ng-bot-tr%C3%B2-chuy%E1%BB%87n-n%C3%B3i-ch%C3%A0o-vector-hi%E1%BB%87n-%C4%91%E1%BA%A1i-ph%E1%BA%B3ng-h%C3%ACnh-minh-h%E1%BB%8Da-nh%C3%A2n.jpg?s=1024x1024&w=is&k=20&c=gCqq3LF7PLfY-sdYrKUvpdgcnSsm5FVFjuw5sF6pWn8=',
      },
      content:
        'Xin chào, tui là AI, tui có thể trả lời bất cứ câu hỏi nào của bạn.',
      role: 'assistant',
    },
  ]);

  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (message) {
      const _message = {
        sender: {
          username: user_info?.person?.username ?? 'Tui nè',
          avatar:
            user_info?.person.avatar ??
            'https://media.istockphoto.com/id/1073076312/vi/vec-to/robot-m%E1%BB%89m-c%C6%B0%E1%BB%9Di-d%E1%BB%85-th%C6%B0%C6%A1ng-bot-tr%C3%B2-chuy%E1%BB%87n-n%C3%B3i-ch%C3%A0o-vector-hi%E1%BB%87n-%C4%91%E1%BA%A1i-ph%E1%BA%B3ng-h%C3%ACnh-minh-h%E1%BB%8Da-nh%C3%A2n.jpg?s=1024x1024&w=is&k=20&c=gCqq3LF7PLfY-sdYrKUvpdgcnSsm5FVFjuw5sF6pWn8=',
        },
        content: message,
        isMe: true,
        role: 'user',
      };

      const newMessages = [...messages, _message];
      setMessages(newMessages);
      setMessage('');
      // AI api
      await processMessageToChatGPT(newMessages);
    }
  };

  const processMessageToChatGPT = async chatMessages => {
    const apiKey = env.REACT_APP_OPENAI_API_KEY;

    let apiMessages = chatMessages.map(_message => {
      return {role: _message.role, content: _message.content};
    });

    const systemMessage = {
      role: 'system',
      content: 'Explain all accepts...',
    };

    const apiReqBody = {
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...apiMessages],
    };

    await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiReqBody),
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setMessages([
          ...chatMessages,
          {
            sender: {
              username: 'AI',
              avatar:
                'https://media.istockphoto.com/id/1073076312/vi/vec-to/robot-m%E1%BB%89m-c%C6%B0%E1%BB%9Di-d%E1%BB%85-th%C6%B0%C6%A1ng-bot-tr%C3%B2-chuy%E1%BB%87n-n%C3%B3i-ch%C3%A0o-vector-hi%E1%BB%87n-%C4%91%E1%BA%A1i-ph%E1%BA%B3ng-h%C3%ACnh-minh-h%E1%BB%8Da-nh%C3%A2n.jpg?s=1024x1024&w=is&k=20&c=gCqq3LF7PLfY-sdYrKUvpdgcnSsm5FVFjuw5sF6pWn8=',
            },
            content: data.choices[0].message.content,
            role: 'assistant',
          },
        ]);
        // setTyping(false);
      });
  };

  return (
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
          <Text
            style={
              styles.header_left_username
            }>{`Hỏi Xoáy Đáp Xoáy Luôn Cùng AI`}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({animated: true})
        }>
        {messages.map((message, index) => {
          return <MessageItem message={message} key={index} />;
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
          borderColor: '#cccc',
        }}
        value={message}
        onChangeText={val => setMessage(val)}
        mode={'flat'}
      />
    </KeyboardAvoidingView>
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
    width: '80%',
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

export default ChatGPTScreen;
