// Isadora Gomes da Silva
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, Platform, KeyboardAvoidingView} from 'react-native';
import app from '../../firebaseConfig'; // () =>  arrow function uma função mais simplificada/rápida

// linha15 then - vai acontecer mas nao ficamos 'esperando',outras coisas podem acontecer enquanto ela não é iniciada, é uma promessa -- linha18 catch é como se fosse o else, a promessa não é cumprida

const RealizarLogin = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const validateLogin = () => { 
        if (!email.includes('@')) {
            window.alert('Erro, insira um email válido.');
            return;
        }
        
        if (email === 'sesi@gmail.com' && password === '707070') {
            window.alert('Login realizado com sucesso!');
        navigation.navigate('PaginaPrincipal');
            
        } else {
            window.alert('Erro, email ou senha incorretos.');
        }
    }; 
    return(
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding': 'height'} style={{ flex: 1}}>

        <View style={styles.container}>
            <Image source={require('../../assets/img/sesir.png')} style={styles.img}/>
            
            <TextInput style={styles.input}
            placeholder='Email' 
            onChangeText={setEmail} 
            value={email}
            placeholderTextColor={"#8058ac"} />

            <TextInput style={styles.input}
            secureTextEntry={true} 
            placeholder='Senha' 
            onChangeText={setPassword} 
            value={password} 
            placeholderTextColor={"#8058ac"} />

            <Pressable style={styles.botao} onPress={validateLogin}> 
                <Text style={styles.textBotao}>Entrar</Text> 
            </Pressable>
        </View>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ded9f6',
    },
    input:{
        fontFamily: 'Gotham',
        height: 47,
        width:350,
        margin: 12,
        borderWidth: 3,
        padding: 12,
        borderRadius: 10,
        borderColor: '#8058ac',
    },
    botao:{
        backgroundColor: '#8058ac',
        borderRadius: 10,
        padding: 12,
        width: 125,
        gap: 5,
        marginTop: 15,
    },
    textBotao:{
        textAlign: 'center',
        marginRight: 'auto',
        marginLeft: 'auto',
        fontFamily: 'Gotham',
        color: '#FFFFFF',
        fontWeight: 500,
        fontSize: 20,
    },
    img:{
        width: 170,
        height: 76,
        margin: 30,
    },
});
export default RealizarLogin;