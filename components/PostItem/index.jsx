import {
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import ICon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {infoSelector} from '../../redux/selectors/infoSelector';
import HTML from 'react-native-render-html';
import RouterKey from '../../utils/Routerkey';
import moment from 'moment';

function PostItem({post, navigation, is_comment}) {
  const user_info = useSelector(infoSelector);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        if (!is_comment) {
          navigation.navigate(RouterKey.UTILS_POST_DETAIL_SCREEN, {post: post});
        }
      }}>
      <View style={styles.header}>
        <Image
          source={{uri: post.author.person.avatar}}
          style={styles.header_avatar}
        />
        <Text style={styles.header_username}>
          {post.author.person.username}
        </Text>

        <Text style={styles.header_time}>
          - {moment(new Date(post.createdAt)).fromNow()}
        </Text>
      </View>

      <View style={styles.body}>
        {is_comment ? null : <Text>{post.title}</Text>}
        <HTML
          source={{html: post.content}}
          contentWidth={useWindowDimensions().width}
        />

        {post.images.map(image => (
          <Image source={{uri: image}} style={styles.content_image} />
        ))}
      </View>

      {is_comment ? null : (
        <View style={styles.actions}>
          <View style={styles.action_status}>
            {post.likes.includes(user_info._id) ? (
              <ICon name={'heart'} size={18} color={'#ff595e'} />
            ) : (
              <ICon name={'ios-heart-outline'} size={18} color={'#ff595e'} />
            )}
            <Text>{post.likes.length}</Text>
          </View>

          <View style={styles.action_comment}>
            <ICon
              name={'ios-chatbubble-ellipses'}
              size={18}
              color={'#0a9396'}
            />
            <Text>{post.comments.length}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 'auto',
    height: 'auto',
    borderWidth: 1,
    marginTop: 4,
    marginHorizontal: 4,
    borderColor: '#2a9d8f',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
  },

  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  header_avatar: {
    width: 32,
    height: 32,
    borderRadius: 50,
  },

  header_username: {
    fontSize: 16,
    fontWeight: '700',
    color: '#252422',
    marginLeft: 8,
  },

  header_time: {
    fontSize: 12,
    marginLeft: 8,
  },
  body: {
    marginTop: 8,
  },

  content_image: {
    width: 'auto',
    height: 'auto',
  },

  actions: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#2a9d8f',
    display: 'flex',
    flexDirection: 'row',
  },
  action_status: {
    display: 'flex',
    flexDirection: 'row',
  },
  action_comment: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 8,
  },
});

export default PostItem;
