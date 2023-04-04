import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import ICon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import HTML from 'react-native-render-html';
import {infoSelector} from '../../../redux/selectors/infoSelector';
import {useEffect, useState} from 'react';
import {
  dislikePost,
  getCommentByPost,
  likePost,
} from '../../../services/patient/post';
import PostItem from '../../../components/PostItem';

function PostDetailScreen({navigation, route}) {
  const user_info = useSelector(infoSelector);

  const {post} = route.params;
  const [postItem, setPost] = useState(post);
  const [comments, setComments] = useState([]);
  const [size, setSize] = useState(2);

  useEffect(() => {
    getCommentByPost(post._id)
      .then(value => setComments(value.data))
      .catch();
  }, []);

  const handleLikePost = () => {
    likePost(post._id, user_info._id)
      .then(value => setPost(value.data))
      .catch();
  };

  const handleDislikePost = () => {
    dislikePost(post._id, user_info._id)
      .then(value => setPost(value.data))
      .catch(err => console.log(err));
  };

  const handleSendComment = () => {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{uri: postItem.author.person.avatar}}
          style={styles.header_avatar}
        />
        <Text style={styles.header_username}>
          {postItem.author.person.username}
        </Text>
      </View>
      <View style={styles.body}>
        <Text>{postItem.title}</Text>

        <View style={styles.content_html}>
          <HTML
            source={{html: postItem.content}}
            contentWidth={useWindowDimensions().width}
          />
        </View>

        {postItem.images.map(image => (
          <Image
            source={{uri: image}}
            style={styles.content_image}
            key={image}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <View style={styles.action_status}>
          {postItem.likes.includes(user_info._id) ? (
            <TouchableOpacity onPress={handleDislikePost}>
              <ICon name={'heart'} size={24} color={'#ff595e'} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleLikePost}>
              <ICon name={'ios-heart-outline'} size={24} color={'#ff595e'} />
            </TouchableOpacity>
          )}
          <Text>{postItem.likes.length}</Text>
        </View>

        <View style={styles.action_comment}>
          <ICon name={'ios-chatbubble-ellipses'} size={24} color={'#0a9396'} />
          <Text>{postItem.comments.length}</Text>
        </View>
      </View>

      <View style={styles.input_view}>
        <TextInput style={styles.input_text} />
        <TouchableOpacity onPress={handleSendComment}>
          <ICon name={'ios-paper-plane-outline'} size={24} color={'#0a9396'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{height: '83%'}}>
        {comments.slice(0, 2).map((comment, index) => {
          comment.patient_id
            ? (comment['author'] = comment.patient_id)
            : (comment['author'] = comment.doctor_id);

          return <PostItem post={comment} is_comment={true} key={index} />;
        })}
      </ScrollView>
    </View>
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

  body: {
    marginTop: 8,
  },

  content_html: {
    marginBottom: 8,
  },

  content_image: {
    width: 'auto',
    height: 302,
  },

  actions: {
    borderTopWidth: 1,
    borderTopColor: '#2a9d8f',
    display: 'flex',
    flexDirection: 'row',
  },
  action_status: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  action_comment: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },

  input_view: {
    marginTop: 8,
    borderWidth: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input_text: {
    width: '90%',
  },
});

export default PostDetailScreen;
