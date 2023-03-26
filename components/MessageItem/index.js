import {StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-paper';

function MessageItem({message}) {
  return (
    <View
      style={[
        styles.message_box,
        message.isMe && {
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginRight: '22%',
        },
      ]}>
      <Avatar.Image size={24} source={{uri: message.sender.avatar}} />
      <View
        style={[
          styles.message_text,
          {
            backgroundColor: message.content.startsWith('Nhắc nhở:')
              ? '#f6bd60'
              : '#caf0f8',
          },
        ]}>
        <Text
          style={[
            styles.message_username,
            message.isMe && {textAlign: 'right'},
          ]}>
          {message.sender.username}
        </Text>
        <Text style={message.isMe && {textAlign: 'right'}}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    minHeight: 50,
    backgroundColor: '#caf0f8',
    borderRadius: 16,
    padding: 8,
    margin: 2,
  },
  message_username: {
    fontWeight: '700',
  },
});

export default MessageItem;
