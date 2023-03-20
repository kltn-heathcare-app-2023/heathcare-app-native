import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import moment from 'moment';

function ConversationItem({conversation, onPress}) {
  return (
    <TouchableOpacity style={styles.conversation_container} onPress={onPress}>
      <Image
        source={{uri: conversation.member.avatar}}
        style={styles.conversation_avatar}
      />

      <View style={styles.conversation_content}>
        <View style={styles.conversation_content_header}>
          <Text style={styles.conversation_username}>
            {conversation.member.username}
          </Text>
          <Text>
            {moment(conversation.last_message.createdAt).fromNow() ?? ''}
          </Text>
        </View>
        <View>
          <Text style={styles.conversation_message}>
            {conversation.last_message.content ?? ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  conversation_container: {
    backgroundColor: '#B4E4FF',
    height: 100,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
    borderRadius: 16,
  },
  conversation_avatar: {
    width: 80,
    height: 80,
    marginLeft: 8,
    borderRadius: 50,
  },
  conversation_content: {
    padding: 8,
    width: '75%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  conversation_content_header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  conversation_username: {
    fontSize: 16,
    fontWeight: '700',
  },
  conversation_message: {
    maxWidth: '100%',
  },
});

export default ConversationItem;
