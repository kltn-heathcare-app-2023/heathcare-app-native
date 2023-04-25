import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RouterKey from '../../utils/Routerkey';
import ConversationScreen from '../../screens/main/messages/conversations';
import ConversationDetail from '../../screens/main/messages/message';
import CallVideoScreen from '../../screens/main/messages/call-video';
const Stack = createNativeStackNavigator();

function ConversationNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={RouterKey.CONVERSATION_SCREEN}>
      {/* <Stack.Screen
        name={RouterKey.CONVERSATION_SCREEN}
        component={ConversationScreen}
      /> */}
      {/* <Stack.Screen
        name={RouterKey.CONVERSATION_DETAIL_SCREEN}
        component={ConversationDetail}
      /> */}
      {/* <Stack.Screen
                name={RouterKey.CALL_VIDEO_SCREEN}
                component={CallVideoScreen}
            /> */}
    </Stack.Navigator>
  );
}

export default ConversationNavigator;
