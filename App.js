import RootStackNavigator from './routers/RootNavigator';

import {LogBox} from 'react-native';
import {store} from './redux/store';
import {Provider, useSelector} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {StatusBar} from 'react-native';

import env from './utils/env';

LogBox.ignoreLogs([
  'Key "cancelled" in the image picker result is deprecated and will be removed in SDK 48, use "canceled" instead',
  'Non-serializable values were found in the navigation state',
  'componentWillMount has been renamed, and is not recommended for use',
  'componentWillReceiveProps has been renamed, and is not recommended for use',
]); // Ignore log notification by message

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <StatusBar
          animated={true}
          backgroundColor="#cccc"
          barStyle={'light-content'}
          showHideTransition={'fade'}
          // hidden={''}
        />
        <RootStackNavigator />
        {/* </ZegoUIKitPrebuiltCallWithInvitation> */}
      </PaperProvider>
    </Provider>
  );
}
