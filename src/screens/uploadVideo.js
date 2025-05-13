// Isadora Gomes da Silva e Ana Lívia dos Santos Lopes
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  TextInput,
  Modal
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import s3 from '../../awsConfig';
import * as Notifications from "expo-notifications";

const S3_BUCKET = "bucket-storage-senai-9";

export default function UploadVideo({ navigation }) {
  const [video, setVideo] = useState(null);
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['video/*'],
        copyToCacheDirectory: true,
      });

      const asset = result.assets && result.assets.length > 0 ? result.assets[0] : result;

      if (asset && asset.uri) {
        setVideo({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'video/mp4',
        });
        setModalVisible(true);
      } else {
        alert('Erro', 'Nenhum vídeo selecionado.');
      }
    } catch (error) {
      console.error('Erro ao selecionar vídeo: ', error);
      alert('Erro', 'Não foi possível selecionar o vídeo.');
    }
  };

  const uploadVideo = async () => {
    if (!video) {
      alert('Erro', 'Por favor, selecione um vídeo.');
      return;
    }

    if (!category.trim()) {
      alert('Erro', 'Por favor, insira um nome de categoria.');
      return;
    }

    try {
      setUploading(true);
      const response = await fetch(video.uri);
      const blob = await response.blob();
      const filePath = `videos/${category}/${Date.now()}_${video.name}`;

      const uploadParams = {
        Bucket: S3_BUCKET,
        Key: filePath,
        Body: blob,
        ContentType: video.type,
      };

      s3.upload(uploadParams, (err, data) => {
        setUploading(false);
        if (err) {
          console.error('Erro no upload: ', err);
          alert('Erro', 'Falha no envio do vídeo');
        } else {
          console.log('Vídeo enviado! URL: ', data.Location);
          alert('Sucesso', 'Vídeo enviado com sucesso!');
          setVideo(null);
          setCategory('');
        }
      });
      const permissao = await requestLocalNotificationPermission();

      if (permissao) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Imagem adicionada!",
            body: `${filename} foi incluído em listar imagens.`,
            sound: true,
          },
          trigger: null,
        });
      }

    } catch (error) {
      console.error('Erro no upload: ', error);
      alert('Erro', 'Falha no envio do vídeo');
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.botao} onPress={pickVideo}>
        <Text style={styles.botaoTexto}>Selecionar Vídeo</Text>
      </Pressable>

      {video && (
        <View style={styles.videoInfo}>
          <Text style={styles.videoText}>Vídeo selecionado: {video.name}</Text>
        </View>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Digite a categoria do vídeo:</Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="Categoria"
              style={styles.input}
            />
            <Pressable
              style={styles.botao}
              onPress={() => {
                setModalVisible(false);
                uploadVideo();
              }}
            >
              <Text style={styles.botaoTexto}>Enviar Vídeo</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {uploading && (
        <View style={styles.uploadingContainer}>
          <Text style={styles.uploadingText}>Enviando vídeo...</Text>
        </View>
      )}

      <Pressable
        style={styles.logoutBotao}
        onPress={() => navigation.navigate('PaginaPrincipal')}
      >
        <Text style={styles.textBotaoOut}>Voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#8058ac',
  },
  botao: {
    backgroundColor: '#ded9f6',
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  botaoTexto: {
    color: '#2e0f48',
    fontSize: 19,
    fontWeight: 'bold',
    fontFamily: 'Gotham, sans-serif',
  },
  videoInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  videoText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Gotham, sans-serif',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitulo: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Gotham, sans-serif',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 5,
    marginBottom: 20,
  },
  uploadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  uploadingText: {
    fontSize: 16,
    color: '#666',
  },
  logoutBotao: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 7,
    width: 100,
    alignSelf: 'center',
    marginTop: 120,
    marginBottom: 30,
  },
  textBotaoOut: {
    textAlign: 'center',
    fontFamily: 'Gotham, sans-serif',
    color: 'white',
    fontWeight: '400',
    fontSize: 18,
  },
});
