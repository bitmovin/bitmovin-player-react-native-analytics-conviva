import { registerRootComponent } from 'expo';

import App from './src/App';
import { SharedObjectSmoke } from './src/sharedObjectSmoke';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(
  process.env.EXPO_PUBLIC_SHARED_OBJECT_SMOKE === '1' ? SharedObjectSmoke : App
);
