// Isadora Gomes da Silva e Ana Lívia dos Santos Lopes
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Video } from "expo-av";
import s3 from '../../awsConfig';

export default function ListarVideosPorCategoria({ navigation }) {
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const bucketName = 'bucket-storage-senai-9';

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await s3
        .listObjectsV2({
          Bucket: bucketName,
          Prefix: 'videos/',
          Delimiter: '/',
        })
        .promise();

      const folders = response.CommonPrefixes.map(({ Prefix }) =>
        Prefix.replace('videos/', '').replace('/', '')
      );

      setCategories(folders);
      if (folders.length > 0) {
        setCategory(folders[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias: ', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchVideos = async () => {
    if (!category) return;

    setLoading(true);
    const prefix = `videos/${category}/`;

    try {
      const response = await s3
        .listObjectsV2({
          Bucket: bucketName,
          Prefix: prefix,
        })
        .promise();

      const videoFiles = response.Contents?.filter(
        (file) => file.Size > 0 && !file.Key.endsWith('/')
      );

      const videoUrls =
        videoFiles?.map((file) => ({
          key: file.Key,
          name: file.Key.split('/').pop(),
          url: `https://${bucketName}.s3.amazonaws.com/${encodeURI(file.Key)}`,
        })) || [];

      setVideos(videoUrls);
    } catch (error) {
      console.error('Erro ao carregar vídeos: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category) {
      fetchVideos();
    }
  }, [category]);

  return (
    <View style={styles.container}>
      {loadingCategories ? (
        <ActivityIndicator size="large" color="#1e90ff" />
      ) : (
        <>
          <Text style={styles.label}>Selecione uma categoria:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              {categories.map((item) => (
                <Picker.Item key={item} label={item} value={item} />
              ))}
            </Picker>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#1e90ff"
              style={styles.loadingIndicator}
            />
          ) : (
            <ScrollView contentContainerStyle={styles.videoList}>
              {videos.map((item) => (
                <Pressable
                  key={item.key}
                  style={styles.videoItem}
                  onPress={() =>
                    navigation.navigate('VideoPlayer', { videoUrl: item.url })
                  }
                >
                  <Text style={styles.videoText}>{item.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </>
      )}

<Pressable style={styles.logoutBotao} onPress={() => navigation.navigate('PaginaPrincipal')}>
                <Text style={styles.textBotaoOut}>Voltar</Text>
            </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  videoList: {
    paddingVertical: 10,
  },
  videoItem: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  videoText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Gotham, sans-serif',
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




