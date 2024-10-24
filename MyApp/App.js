import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Image, Alert } from 'react-native';
import { Appbar, Button, Snackbar } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  const [dogImage, setDogImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    fetchDogImage();
  }, []);

  const fetchDogImage = async () => {
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const json = await response.json();
      setDogImage(json.message);
    } catch (err) {
      setError(err);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (dogImage) {
      const fileUri = FileSystem.documentDirectory + dogImage.split('/').pop();

      try {
        const response = await FileSystem.downloadAsync(dogImage, fileUri);
        Alert.alert('Download concluído', `Imagem salva em: ${response.uri}`);
      } catch (error) {
        Alert.alert('Erro ao baixar a imagem', error.message);
      }
    }
  };

  const onDismissSnackbar = () => setSnackbarVisible(false);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Imagens de Cães" />
        </Appbar.Header>
        {dogImage && (
          <Image source={{ uri: dogImage }} style={styles.image} />
        )}
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={fetchDogImage}>
            Nova Imagem
          </Button>
          <Button mode="contained" onPress={downloadImage}>
            Baixar Imagem
          </Button>
        </View>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={onDismissSnackbar}
          action={{
            label: 'Fechar',
            onPress: onDismissSnackbar,
          }}>
          {error ? 'Ocorreu um erro ao carregar a imagem.' : ''}
        </Snackbar>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
});

export default App;
