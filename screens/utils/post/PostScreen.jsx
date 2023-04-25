import {useEffect, useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {getAllPost} from '../../../services/patient/post';
import PostItem from '../../../components/PostItem';
import {ActivityIndicator, Button} from 'react-native-paper';
import Header from '../../../components/Header';
import RouterKey from '../../../utils/Routerkey';

function PostListScreen({navigation}) {
  const [postList, setPostList] = useState([]);
  const [size, setSize] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllPost().then(value => {
      setPostList(value.data);
      setLoading(false);
    });
  }, []);

  const handleLoadMore = () => {
    if (size < postList.length) {
      setSize(size + 5);
    }
  };

  const handleReload = () => {
    setSize(5);
  };

  return (
    <>
      <Header
        title={'Cộng đồng'}
        handle={() => navigation.navigate(RouterKey.HOME_SCREEN)}
      />

      {!loading && postList.length > 0 ? (
        <ScrollView>
          {postList.slice(0, size).map((post, index) => (
            <PostItem
              key={post._id}
              post={post}
              navigation={navigation}
              is_post
            />
          ))}

          {size < postList.length ? (
            <Button onPress={handleLoadMore}>Tải thêm</Button>
          ) : (
            <Button onPress={handleReload}>Tải lại</Button>
          )}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator
            animating={true}
            color={'#00bbf9'}
            size={'large'}
          />
        </View>
      )}
    </>
  );
}

export default PostListScreen;
