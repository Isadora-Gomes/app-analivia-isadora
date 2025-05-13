// Isadora Gomes da Silva e Ana Lívia dos Santos Lopes 3º
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Pressable, Alert } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import s3 from '../../awsConfig';
import * as Notifications from "expo-notifications";

const S3_BUCKET = "bucket-storage-senai-9";

const UploadFoto = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);

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


  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão necessária", "Precisamos da permissão para acessar suas fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      alert("Erro", "Nenhuma imagem selecionada.");
      return;
    }

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = `imagens/${Date.now()}.jpg`;

      const params = {
        Bucket: S3_BUCKET,
        Key: filename,
        Body: blob,
        ContentType: "image/jpeg",
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.error("Erro no upload:", err);
          alert("Erro", "Falha no envio da imagem.");
        } else {
          console.log("Imagem disponível em:", data.Location);
          alert("Sucesso", "Imagem salva com sucesso!");
          setImageUri(null);
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
      console.error("Erro no upload:", error);
      alert("Erro", "Falha no envio da imagem.");
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={escolherImagem}>
        <Text style={styles.buttonText}>Escolher imagem</Text>
      </Pressable>

      {imageUri && (
        <View>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
        />
      <Pressable style={styles.button} onPress={uploadImage}>
        <Text style={styles.buttonText}>Fazer upload da imagem</Text>
      </Pressable>
        </View>
      )}
    <Pressable style={styles.logoutBotao} onPress={() => navigation.navigate('PaginaPrincipal')}>
                <Text style={styles.textBotaoOut}>Voltar</Text>
            </Pressable>
    </View>
  );
};
export default UploadFoto;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: '#8058ac',
  },
  button: {
    backgroundColor: '#ded9f6',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#2e0f48',
    fontSize: 19,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
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


  
