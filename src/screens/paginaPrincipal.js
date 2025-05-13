// Isadora Gomes da Silva e Ana Lívia dos Santos Lopes
import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

const PaginaPrincipal = ({ navigation }) => {
    return (
            <View style={styles.container}>
                <Text style={styles.text1}>Bem-vindo ao SESI!</Text>

                <Pressable style={styles.botao} onPress={() => navigation.navigate('ListarJogadores')}>
                    <Text style={styles.textBotao}>Lista de jogadores</Text>
                </Pressable>

                <Pressable style={styles.botao} onPress={() => navigation.navigate('ListarImagens')}>
                    <Text style={styles.textBotao}>Listar IMG</Text>
                </Pressable>

                <Pressable style={styles.botao} onPress={() => navigation.navigate('UploadImagens')}>
                    <Text style={styles.textBotao}>Upload IMG</Text>
                </Pressable>

                <Pressable style={styles.botao} onPress={() => navigation.navigate('ListarVideos')}>
                    <Text style={styles.textBotao}>Listar vídeos</Text>
                </Pressable>

                <Pressable style={styles.botao} onPress={() => navigation.navigate('UploadVideos')}>
                    <Text style={styles.textBotao}>Upload vídeos</Text>
                </Pressable>

                <Pressable style={styles.botao} onPress={() => navigation.navigate('RealizarLogin')}>
                    <Text style={styles.textBotao}>Sair</Text>
                </Pressable>
            </View>
    );
};
export default PaginaPrincipal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8058ac',
        height: '100vh',
    },
    text1: {
        fontFamily: 'Gotham, sans-serif',
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        margin: 40,
        color: '#ded9f6',

    },
    botao: {
        backgroundColor: '#ded9f6',
        borderRadius: 10,
        padding: 12,
        width: 225,
        height: 50,
        gap: 5,
        marginBottom: 6,
        marginTop: 15,
    },
    textBotao: {
        textAlign: 'center',
        marginRight: 'auto',
        marginLeft: 'auto',
        fontFamily: 'Gotham',
        color: '#2e0f48',
        fontWeight: 500,
        fontSize: 20,
    },
});