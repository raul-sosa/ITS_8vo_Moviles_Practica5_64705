import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useRef, useEffect } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View, Animated, Easing } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import useNotes, { Note } from '../hooks/useNotes';
import { useThemeContext } from '../hooks/useThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const NoteCard = ({ note, onEdit, onDelete, isDark }: { note: Note, onEdit: (id: number) => void, onDelete: (id: number) => void, isDark: boolean }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => { Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start(); };
  const onPressOut = () => { Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start(); };

  const plainText = note.descripcion
    .replace(/<[^>]+>/g, ' ') 
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        activeOpacity={0.9}
        onPressIn={onPressIn} 
        onPressOut={onPressOut} 
        onPress={() => onEdit(note.id)}
        style={styles.cardWrapper}
      >
        <BlurView intensity={100} tint={isDark ? "dark" : "light"} style={[styles.glassCard, !isDark && styles.glassLight]}>
          <Text style={[styles.cardTitle, isDark ? styles.textDark : styles.textLightTitle]}>{note.titulo}</Text>
          <Text 
            numberOfLines={3} 
            ellipsizeMode="tail"
            style={[styles.cardContent, isDark ? styles.contentDark : styles.contentLight]}
          >
            {plainText || "Sin descripción..."}
          </Text>
          <View style={[styles.cardActions, !isDark && {borderTopColor: 'rgba(0,0,0,0.05)'}]}>
            <IconButton icon="pencil" iconColor={isDark ? "#93C5FD" : "#3B82F6"} size={22} onPress={() => onEdit(note.id)} style={styles.actionBtn} />
            <IconButton icon="delete" iconColor="#EF4444" size={22} onPress={() => onDelete(note.id)} style={styles.actionBtn} />
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function NotesListScreen() {
  const router = useRouter();
  const { isDark } = useThemeContext();
  const { notes, isLoading, error, deleteNote, loadNotes } = useNotes();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 6000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 6000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    ).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          router.replace('/login');
        } else {
          loadNotes();
        }
      };
      checkAuth();
    }, [loadNotes])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/login');
  };

  const translateY1 = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -100] });
  const translateY2 = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 100] });
  const scaleObj = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] });

  if (isLoading) {
    return (
      <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
        <ActivityIndicator animating={true} size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <Stack.Screen 
        options={{
          headerRight: () => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <ThemeToggle />
              <IconButton icon="logout" iconColor="#ef4444" size={24} onPress={handleLogout} />
            </View>
          )
        }}
      />

      {/* Amplified Background Animations */}
      <Animated.View style={[styles.circle, styles.circle1, !isDark && {opacity: 0.3}, { transform: [{ translateY: translateY1 }, { scale: scaleObj }] }]} />
      <Animated.View style={[styles.circle, styles.circle2, !isDark && {opacity: 0.3}, { transform: [{ translateY: translateY2 }, { scale: scaleObj }] }]} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : notes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="note-add" size={60} color={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.2)"} />
            <Text style={[styles.emptyText, !isDark && {color: '#64748B'}]}>Aún no tienes notas creadas.</Text>
          </View>
        ) : (
          notes.map(note => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onEdit={(id) => router.push(`/create-note?id=${id}`)} 
              onDelete={async (id) => {
                Alert.alert('Eliminar Nota', '¿Estás seguro?', [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Eliminar', style: 'destructive', onPress: async () => { await deleteNote(id); } }
                ]);
              }}
              isDark={isDark}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fabWrapper} activeOpacity={0.8} onPress={() => router.push('/create-note')}>
        <BlurView intensity={100} tint={isDark ? "light" : "dark"} style={[styles.fabGlass, !isDark && {borderColor: 'rgba(255,255,255,0.8)'}]}>
          <MaterialIcons name="add" size={30} color={isDark ? "#1E1E2C" : "#fff"} />
        </BlurView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  containerDark: { backgroundColor: '#0F172A' },
  containerLight: { backgroundColor: '#F8FAFC' },
  circle: { position: 'absolute', borderRadius: 300, opacity: 0.5 },
  circle1: { width: 400, height: 400, backgroundColor: '#3B82F6', top: -100, left: -150 },
  circle2: { width: 350, height: 350, backgroundColor: '#7C3AED', bottom: -50, right: -100 },
  scrollContainer: { paddingTop: 100, paddingBottom: 100, paddingHorizontal: 20 },
  cardWrapper: { marginBottom: 16, borderRadius: 24, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10 },
  glassCard: { padding: 20, borderRadius: 24, borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(0,0,0,0.2)' },
  glassLight: { borderColor: 'rgba(255, 255, 255, 0.6)', backgroundColor: 'rgba(255,255,255,0.3)' },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  textDark: { color: '#fff' },
  textLightTitle: { color: '#1E293B' },
  cardContent: { fontSize: 14, lineHeight: 20 },
  contentDark: { color: '#CBD5E1' },
  contentLight: { color: '#475569' },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)', paddingTop: 5 },
  actionBtn: { margin: 0 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { textAlign: 'center', marginTop: 15, fontSize: 16, color: '#94A3B8' },
  errorText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#EF4444' },
  fabWrapper: { position: 'absolute', right: 25, bottom: 30, borderRadius: 30, overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  fabGlass: { width: 60, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 30, borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.2)' },
});