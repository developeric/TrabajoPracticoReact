import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  rating: string;
  imageUrl: string;
}

export default function HomeScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [catalog, setCatalog] = useState<MediaItem[]>([]);

  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 600;

  // Max layout width of 800px
  const containerWidth = Math.min(windowWidth, 800);
  // Padding wrapper is 12px on each side (24 total). Spacing between columns is 8px * 2 = 16.
  const cardWidth = (containerWidth - 24 - 16) / 3;

  // useEffect para cargar las 2 películas de prueba iniciales al montar
  useEffect(() => {
    setCatalog([
      {
        id: '1',
        title: 'Interstellar',
        description: 'Un viaje cinematográfico espectacular a través de agujeros de gusano y galaxias distantes, explorando el amor de un padre y el destino de la humanidad.',
        rating: '9.0',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg',
      },
      {
        id: '2',
        title: 'Inception',
        description: 'Un fascinante thriller de ciencia ficción donde un grupo de especialistas se adentra en los laberintos de la mente humana para sembrar una idea.',
        rating: '8.8',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg',
      },
    ]);
  }, []);

  // Función para agregar un nuevo elemento al catálogo
  const handleAddMedia = () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !rating.trim() ||
      !imageUrl.trim()
    ) {
      Alert.alert('Error', 'Todos los campos son obligatorios para poder registrar la película o serie.');
      return;
    }

    const newItem: MediaItem = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      rating: rating.trim(),
      imageUrl: imageUrl.trim(),
    };

    setCatalog((prevCatalog) => [newItem, ...prevCatalog]);

    setTitle('');
    setDescription('');
    setRating('');
    setImageUrl('');
  };

  // Función para eliminar un elemento del catálogo
  const handleDeleteMedia = (id: string) => {
    setCatalog((prevCatalog) => prevCatalog.filter((item) => item.id !== id));
  };

  // Convertir la puntuación a estrellas estilo Letterboxd (escala de 5 estrellas)
  const renderStars = (ratingStr: string) => {
    const ratingVal = parseFloat(ratingStr);
    if (isNaN(ratingVal)) return ratingStr;

    const rating = ratingVal > 5 ? ratingVal / 2 : ratingVal;

    const clampedRating = Math.max(0, Math.min(5, rating));
    const fullStars = Math.floor(clampedRating);
    const hasHalf = clampedRating - fullStars >= 0.5;

    let stars = '★'.repeat(fullStars);
    if (hasHalf && fullStars < 5) {
      stars += '½';
    }

    return stars || '☆';
  };

  // Renderiza la tarjeta del formulario
  const renderFormCard = (isFullWidth: boolean) => {
    return (
      <View style={[styles.formCard, isFullWidth ? styles.formCardFullWidth : { width: cardWidth, maxWidth: cardWidth }]}>
        <Text style={styles.formCardTitle}>Nuevo</Text>

        <TextInput
          style={styles.formInput}
          placeholder="Título"
          placeholderTextColor="#8899AA"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />

        <TextInput
          style={[styles.formInput, styles.formTextArea]}
          placeholder="Descripción"
          placeholderTextColor="#8899AA"
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline
          numberOfLines={2}
        />

        <TextInput
          style={styles.formInput}
          placeholder="Punt. (Ej. 9.0)"
          placeholderTextColor="#8899AA"
          value={rating}
          onChangeText={(text) => setRating(text)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.formInput}
          placeholder="URL Img"
          placeholderTextColor="#8899AA"
          value={imageUrl}
          onChangeText={(text) => setImageUrl(text)}
          keyboardType="url"
          autoCapitalize="none"
        />

        {/* Botón táctil para auto-completar la URL de Toy Story */}
        <TouchableOpacity
          onPress={() => setImageUrl('https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg')}
          activeOpacity={0.7}
          style={styles.helperTextTouch}
        >
          <Text style={styles.formHelperText} numberOfLines={2}>
            ★ Auto-completar URL de Toy Story
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.formAddButton}
          onPress={handleAddMedia}
          activeOpacity={0.85}
        >
          <Text style={styles.formAddButtonText}>AGREGAR</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Renderizador de cada item de la grilla
  const renderItem = ({ item }: { item: MediaItem }) => {
    if (item.id === 'ADD_FORM') {
      return renderFormCard(false);
    }

    return (
      <View style={[styles.card, { width: cardWidth, maxWidth: cardWidth }]}>
        <View style={styles.posterContainer}>
          {/* Capa de Placeholder de fondo */}
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderEmoji}>🎬</Text>
            <Text style={styles.placeholderText} numberOfLines={2}>
              {item.title}
            </Text>
          </View>

          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : null}

          <TouchableOpacity
            style={styles.deleteBadge}
            onPress={() => handleDeleteMedia(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteBadgeText}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.starsText}>
            {renderStars(item.rating)}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Mi Catálogo de Medios</Text>
      
      <Text selectable={true} style={styles.headerHelperText}>
        URL de prueba (Toy Story): {"\n"}
        https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg
      </Text>

      {/* Renderizar el formulario a ancho completo en celular */}
      {isMobile && renderFormCard(true)}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Colección Actual ({catalog.length})</Text>
      </View>
    </View>
  );

  // En celular, el formulario se inyecta en el header a ancho completo.
  // En PC/Web, el formulario se coloca como primer item de la grilla 3x3.
  const listData = isMobile 
    ? catalog 
    : [{ id: 'ADD_FORM', title: '', description: '', rating: '', imageUrl: '' } as MediaItem, ...catalog];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.containerWrapper}>
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={styles.rowGrid}
          ListHeaderComponent={renderHeader()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#14181C',
  },
  containerWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'android' ? 12 : 6,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  headerHelperText: {
    fontSize: 11,
    color: '#8899AA',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
    lineHeight: 16,
  },
  sectionHeader: {
    width: '100%',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C3440',
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#99AABB',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  listContent: {
    paddingBottom: 24,
  },
  rowGrid: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  card: {
    marginBottom: 14,
  },
  posterContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 2 / 3,
    backgroundColor: '#2C3440',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#343F4F',
  },
  placeholderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#2C3440',
  },
  placeholderEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  placeholderText: {
    fontSize: 10,
    color: '#8899AA',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    aspectRatio: 2 / 3,
  },
  deleteBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(127, 29, 29, 0.85)',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    zIndex: 10,
  },
  deleteBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  cardDetails: {
    marginTop: 6,
    paddingHorizontal: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  starsText: {
    fontSize: 12,
    color: '#00E054',
    fontWeight: 'bold',
  },
  formCard: {
    backgroundColor: '#2C3440',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#343F4F',
    marginBottom: 14,
  },
  formCardFullWidth: {
    width: '100%',
    marginBottom: 18,
  },
  formCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#99AABB',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#14181C',
    color: '#FFFFFF',
    borderRadius: 4,
    paddingHorizontal: 10,
    height: 46,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#24303C',
    marginBottom: 8,
  },
  formTextArea: {
    height: 68,
    textAlignVertical: 'top',
  },
  helperTextTouch: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 8,
    zIndex: 20,
  },
  formHelperText: {
    fontSize: 9,
    color: '#00E054',
    lineHeight: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  formAddButton: {
    backgroundColor: '#00E054',
    borderRadius: 4,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  formAddButtonText: {
    color: '#14181C',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
