// Isadora Gomes da Silva e Ana Lívia dos Santos Lopes
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RealizarLogin from './src/screens/realizarLogin';
import PaginaPrincipal from './src/screens/paginaPrincipal';

import ListarJogadores from './src/screens/listarJogadores';
import AdicionarJogador from './src/screens/adicionarJogador';

import ListarImagens from './src/screens/listarImg';
import ListarVideos from './src/screens/listarVideo';

import UploadImagens from './src/screens/uploadImg';
import UploadVideos from './src/screens/uploadVideo';

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () =>({
    shoudPlaySound: true,
    shouldSetBadge: false,
    shouldShowAlert: true,

  })
})

const Stack = createNativeStackNavigator();
const App = () => (
// name é a identificação da tela
  <NavigationContainer>
    <Stack.Navigator initialRouteName='RealizarLogin' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RealizarLogin" component={RealizarLogin} /> 
      <Stack.Screen name="PaginaPrincipal" component={PaginaPrincipal} />
      <Stack.Screen name="ListarJogadores" component={ListarJogadores} />
      <Stack.Screen name="AdicionarJogador" component={AdicionarJogador} />
            <Stack.Screen name="ListarImagens" component={ListarImagens} />
      <Stack.Screen name="UploadImagens" component={UploadImagens} />
            <Stack.Screen name="ListarVideos" component={ListarVideos} />
      <Stack.Screen name="UploadVideos" component={UploadVideos} />
    </Stack.Navigator>
  </NavigationContainer>
);
export default App;