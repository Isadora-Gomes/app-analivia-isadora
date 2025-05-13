// Isadora Gomes da Silva e Ana Lívia dos Santos Lopes
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, ActivityIndicator, Pressable } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import s3 from '../../awsConfig';

const BUCKET_NAME = "bucket-storage-senai-9";
const FOLDER = "imagens/";

const ListarImagens = ({ navigation }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await s3
                    .listObjectsV2({ Bucket: BUCKET_NAME, Prefix: FOLDER })
                    .promise();

                const imageFiles = response.Contents.filter((file) =>
                    file.Key.match(/\.(jpg|jpeg|png)$/i)
                );

                const imageURLs = imageFiles.map((file) => ({
                    name: file.Key.split("/").pop(),
                    url: `https://${BUCKET_NAME}.s3.amazonaws.com/${file.Key}`,
                }));

                setImages(imageURLs);
            } catch (error) {
                console.error("Erro ao listar imagens:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Carregando imagens...</Text>
        </View>
    );
}

return (
    <ScrollView contentContainerStyle={styles.container}>
        {images.map((image, index) => (
            <Pressable
            key={index}
            style={styles.imageContainer}
            onPress={() => console.log('Imagem pressionada:', image.name)}
            >
                <Image source={{ uri: image.url }} style={styles.image} />
                <Text style={styles.imageName}>{image.name}</Text>
            </Pressable>
        ))}
        <Pressable style={styles.logoutBotao} onPress={() => navigation.navigate('PaginaPrincipal')}>
                        <Text style={styles.textBotaoOut}>Voltar</Text>
                    </Pressable>
    </ScrollView>
);
}
export default ListarImagens;


const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    imageContainer: {
        marginBottom: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        width: '90%',
        backgroundColor: '#f9f9f9',
    },
    image: {
        width: 300,
        height: 200,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    imageName: {
        marginTop: 8,
        fontSize: 14,
        color: '#333',
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