// Isadora Gomes da Silva e Ana Lívia dos Santos Lopes
import React, { useEffect, useState } from 'react'; // useEffect é um efeito colateral
import { View, Text, FlatList, StyleSheet, Pressable, TextInput, Modal } from 'react-native';
import { db, app } from "../../firebaseConfig";
import { collection, getDocs, getFirestore, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { format } from "date-fns";

const Jogadores = ({ navigation }) => {
    const [jogadores, setJogadores] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [jogadorAtual, setJogadorAtual] = useState(null);

    useEffect(() => {
        const fetchJogadores = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "real-madrid"));

                const jogadoresList = [];
                querySnapshot.forEach(doc => {
                    const data = doc.data();

                    let nascimentoFormatado = "Data não informada";
                    if (data.nascimento && data.nascimento.toDate) {
                        nascimentoFormatado = format(data.nascimento.toDate(), "dd.MM.yyyy");
                    }

                    jogadoresList.push({
                        id: doc.id,
                        nome: data.nome,
                        altura: data.altura,
                        camisa: data.camisa,
                        nascimento: nascimentoFormatado,
                    });
                });

                setJogadores(jogadoresList);
            } catch (error) {
                console.error("Erro ao buscar jogadores:", error);
            }
        };

        fetchJogadores();
    }, []);


    const [nome, setNome] = useState("");
    const [altura, setAltura] = useState("");
    const [camisa, setCamisa] = useState("");
    const [nascimento, setNascimento] = useState("");

    const editarJogador = (jogador) => {
        setJogadorAtual(jogador);
        setNome(jogador.nome);
        setAltura(jogador.altura);
        setCamisa(jogador.camisa);
        setModalVisible(true);
    };

    const salvarJogador = async () => {
        const db = getFirestore(app);
        const jogadorRef = doc(db, "real-madrid", jogadorAtual.id);

        // Converter a data de nascimento de string para Timestamp 
        const [day, month, year] = nascimento.split("/");
        const nascimentoDate = new Date(`${year}-${month}-${day}T00:00:00`);
        const nascimentoTimestamp = Timestamp.fromDate(nascimentoDate);

        await updateDoc(jogadorRef, {
            nome,
            altura: parseFloat(altura),
            camisa,
            nasciment: nascimentoTimestamp,
        });

        const atualizarJogadores = jogadores.map((jogador) =>
            jogador.id === jogadorAtual.id
                ? { ...jogador, nome, altura, camisa, nasciment: nascimento }
                : jogador
        );

        setJogadores(atualizarJogadores);
        setModalVisible(false);
    };




    const deletarJogador = async (id) => {
        const db = getFirestore(app);
        const jogadorRef = doc(db, 'real-madrid', id);

        alert("O jogador será excluido");
        await deleteDoc(jogadorRef);
        setJogadores(jogadores.filter((jogador) => jogador.id !== id));
    }


return (
    <View style={styles.container}>
        <Text style={styles.text1}>Jogadores do Real Madrid:</Text>

        <Pressable style={styles.botaoAdd} onPress={() => navigation.navigate('AdicionarJogador')}>
            <Text style={styles.textAdd}>+ Adicionar jogador</Text>
        </Pressable>

        <FlatList
            data={jogadores}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
                return (
                    <View style={styles.card}>
                        <Text style={styles.list}>Nome: {item.nome}</Text>
                        <Text style={styles.list}>Altura: {item.altura}</Text>
                        <Text style={styles.list}>Camisa: {item.camisa}</Text>
                        <Text style={styles.list}>Nascimento: {item.nascimento}</Text>

                        <View style={styles.botaoED}>

                            <Pressable style={styles.editar} onPress={() => editarJogador(item)}>
                                <Text style={styles.editBotao}>Editar</Text>
                            </Pressable>

                            <Pressable style={styles.deletar} onPress={() => deletarJogador(item.id)}>
                                <Text style={styles.deleteBotao}>Excluir</Text>
                            </Pressable>
                        </View>

                    </View>
                );
            }}
        />
        <Pressable style={styles.logoutBotao} onPress={() => navigation.navigate('PaginaPrincipal')}>
            <Text style={styles.textBotao}>Voltar</Text>
        </Pressable>

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Editar jogador</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        value={nome}
                        onChangeText={setNome}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Altura"
                        value={altura}
                        onChangeText={setAltura}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Camisa"
                        value={camisa}
                        onChangeText={setCamisa}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nascimento (dd/mm/aaaa)"
                        value={nascimento}
                        onChangeText={setNascimento}
                    />

                    <Pressable style={styles.botaoSalvar} onPress={salvarJogador}>
                        <Text style={styles.textBotao}>Salvar</Text>
                    </Pressable>

                    <Pressable style={styles.botaoCancelar} onPress={() => setModalVisible(false)}>
                        <Text style={styles.textBotao}>Cancelar</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    </View>
);
};

export default Jogadores;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8058ac',
        padding: 20,
    },
    text1: {
        margin: 50,
        fontSize: 28,
        textAlign: 'center',
        fontFamily: 'Gotham, sans-serif',
        color: 'white',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#ded9f6',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        width: 300,
    },
    list: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
        fontFamily: 'Gotham, sans-serif',

    },
    logoutBotao: {
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 7,
        width: 100,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    textBotao: {
        textAlign: 'center',
        fontFamily: 'Gotham, sans-serif',
        color: 'white',
        fontWeight: '400',
        fontSize: 18,
    },
    botaoAdd: {
        backgroundColor: '#C1C1C1',
        borderRadius: 10,
        padding: 12,
        width: 225,
        height: 50,
        gap: 5,
        marginTop: 15,
    },
    textAdd: {
        textAlign: 'center',
        marginRight: 'auto',
        marginLeft: 'auto',
        fontFamily: 'Gotham',
        color: '#2e0f48',
        fontWeight: 500,
        fontSize: 20,
    },
    editar: {
        backgroundColor: '#6a1b9a',
        padding: 7,
        width: 20,
        borderRadius: 8,
        flex: 1,
        margin: 7,
    },
    editBotao: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2e0f48',
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
    botaoSalvar: {
        backgroundColor: '#8058ac',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    botaoCancelar: {
        backgroundColor: 'gray',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    deletar: {
        backgroundColor: '#ccc',
        width: 20,
        flex: 1,
        padding: 7,
        borderRadius: 8,
        margin: 7,
    },
    deleteBotao: {
        color: 'black',
        textAlign: 'center',
        fontWeight: '500',
    },
    botaoED: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
});