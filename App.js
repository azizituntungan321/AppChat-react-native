import { createAppContainer, createStackNavigator } from 'react-navigation';
import Home from './app/page/Home';
import Login from './app/page/Login';

const rootNavigation = createStackNavigator({
  pageLogin: {
    screen:Login,
    navigationOptions: {
      header: null,
    }
  },
  pageHome: {
    screen:Home,
    navigationOptions: {
      header: null,
    }
  },
}, {

  });

export default createAppContainer(rootNavigation);