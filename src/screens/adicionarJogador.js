// Isadora Gomes da Silva e Ana Lívia dos Santos Lopes
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { collection, addDoc, getFirestore, Timestamp } from 'firebase/firestore';
import app from '../../firebaseConfig'
import * as Notifications from "expo-notifications";



const AdicionarJogador = ({ navigation }) => {
    const [nome, setNome] = useState("");
    const [altura, setAltura] = useState("");
    const [camisa, setCamisa] = useState("");
    const [nascimento, setNascimento] = useState("");

    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log("Notificação recebida:", notification);
            }
        );
        return () => subscription.remove();
    }, []);

    const requestLocalNotificationPermission = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permissão negada",
                "Ative as notificações para ver os avisos."
            );
            return false;
        }
        return true;
    };


    const addJogador = async () => {
        if (!nome || !altura || !camisa || !nascimento) {
            alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        try {
            const db = getFirestore(app);
            const jogadoresCollection = collection(db, "real-madrid");

            // Converter a data de nascimento de string para Timestamp 
            const [day, month, year] = nascimento.split("/");
            const nascimentoDate = new Date(`${year}-${month}-${day}`);
            const nascimentoTimestamp = Timestamp.fromDate(nascimentoDate);

            await addDoc(jogadoresCollection, {
                nome: nome,
                altura: parseFloat(altura), // convertendo altura para float 
                camisa: camisa,
                nascimento: nascimentoTimestamp, // armazenando como Timestamp 
            });

            const permissao = await requestLocalNotificationPermission();

            if (permissao) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Novo jogador adicionado!",
                        body: `${nome} foi incluído no elenco.`,
                        sound: true,
                    },
                    trigger: null,
                });
            }
            navigation.goBack();

        } catch (error) {
            console.error("Erro ao adicionar jogador:", error);
            alert("Erro", "Ocorreu um erro ao adicionar o jogador.");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text1}>Adicione um jogador do Real Madrid:</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome do jogador"
                value={nome}
                onChangeText={setNome}
            />

            <TextInput
                style={styles.input}
                placeholder="Altura"
                value={altura}
                onChangeText={setAltura}
            />
            <TextInput
                style={styles.input}
                placeholder="Número da camisa"
                value={camisa}
                onChangeText={setCamisa}
            />
            <TextInput
                style={styles.input}
                placeholder="Data de nascimento (dd/mm/aaaa)"
                value={nascimento}
                onChangeText={setNascimento}
            />
            <Pressable style={styles.botao} onPress={addJogador}>
                <Text style={styles.textBotao}>Adicionar</Text>
            </Pressable>

            <Pressable style={styles.logoutBotao} onPress={() => navigation.navigate('PaginaPrincipal')}>
                <Text style={styles.textBotao}>Voltar</Text>
            </Pressable>
        </View>
    );
}
export default AdicionarJogador;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ded9f6',
        flex: 1,
        padding: 20,
    },
    text1: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 50,
        marginBottom: 20,
        color: '#2e0f48',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 18,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    botao: {
        backgroundColor: '#8058ac',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    textBotao: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutBotao: {
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 7,
        width: 100,
        alignSelf: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    textBotao: {
        textAlign: 'center',
        fontFamily: 'Gotham, sans-serif',
        color: 'white',
        fontWeight: '400',
        fontSize: 18,
    },
});