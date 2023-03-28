import moment from 'moment';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Avatar} from 'react-native-paper';

function MessageItem({message}) {
  return (
    <View
      style={[
        styles.message_box,
        message.isMe && {
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'flex-start',
          // marginRight: '22%',
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
        <Text style={{textAlign: message.isMe ? 'left' : 'left'}}>
          {message.content}
        </Text>

        {message?.images &&
          message.images.length > 0 &&
          message.images.map((image, index) => {
            return (
              <Image
                source={{uri: image}}
                key={index}
                style={styles.message_image}
              />
            );
          })}
        <Text
          style={{
            textAlign: message.isMe ? 'right' : 'left',
            fontSize: 12,
            marginTop: 4,
          }}>
          {moment(message.createdAt).fromNow()}
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
    maxWidth: '70%',
    minHeight: 50,
    backgroundColor: '#caf0f8',
    borderRadius: 16,
    padding: 8,
    margin: 2,
  },
  message_username: {
    fontWeight: '700',
  },
  message_image: {
    marginTop: 8,
    minWidth: 200,
    height: 250,
  },
});

export default MessageItem;
