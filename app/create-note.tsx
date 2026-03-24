import CustomRichEditor from '@/components/CustomRichEditor';
import useNotes from '@/hooks/useNotes';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, Animated, Easing } from 'react-native';
import { RichToolbar, actions } from 'react-native-pell-rich-editor';
import { BlurView } from 'expo-blur';
import { useThemeContext } from '../hooks/useThemeContext';

export default function CreateNoteScreen() {
  const router = useRouter();
  const { isDark } = useThemeContext();

  const params = useLocalSearchParams();
  const { id } = params;
  
  const richText = useRef<CustomRichEditor>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [completed, setCompleted] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const { notes, saveNote, updateNote } = useNotes();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 6000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 6000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    ).start();

    if (id) {
      const noteId = Number(id);
      const noteToEdit = notes.find(note => note.id === noteId);
      if (noteToEdit) {
        setTitle(noteToEdit.titulo);
        setContent(noteToEdit.descripcion);
        setCompleted(noteToEdit.completada);
        richText.current?.setContentHTML(noteToEdit.descripcion);
      }
    }
  }, [id, notes]);

  const translateY1 = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -100] });
  const translateY2 = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 100] });
  const scaleObj = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] });

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Por favor ingresa un título para la nota');
      return;
    }

    try {
      if (id) {
        await updateNote(Number(id), { 
          titulo: title, 
          descripcion: content,
          completada: completed
        });
      } else {
        await saveNote({
          titulo: title.trim(),
          descripcion: content,
          completada: completed
        });
      }
      router.back();
    } catch (error) {
      alert('Error al guardar la nota');
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      {/* Background Animated Circles */}
      <Animated.View style={[styles.circle, styles.circle1, !isDark && {opacity: 0.3}, { transform: [{ translateY: translateY1 }, { scale: scaleObj }] }]} />
      <Animated.View style={[styles.circle, styles.circle2, !isDark && {opacity: 0.3}, { transform: [{ translateY: translateY2 }, { scale: scaleObj }] }]} />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={false}
      >
        <BlurView intensity={100} tint={isDark ? "dark" : "light"} style={[styles.glassCard, !isDark && styles.glassLight]}>
          <TextInput
            style={[styles.titleInput, isDark ? styles.textDark : styles.textLightTitle]}
            placeholder="Título de la nota..."
            placeholderTextColor={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"}
            value={title}
            onChangeText={setTitle}
          />

          <View style={[styles.editorWrapper, !isDark && {borderColor: 'rgba(0,0,0,0.1)'}]}>
            <CustomRichEditor
              ref={richText}
              style={styles.editor}
              initialContentHTML={content}
              onChange={setContent}
              placeholder="Escribe el contenido de tu nota aquí..."
              useContainer={true}
              editorStyle={{
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.65)',
                color: '#333',
                placeholderColor: '#555',
              }}
            />
          </View>

          <View style={[styles.toolbarWrapper, !isDark && {borderColor: 'rgba(0,0,0,0.1)'}]}>
            <RichToolbar
              editor={richText}
              selectedIconTint="#3B82F6"
              iconTint="#555"
              scalesPageToFit={Platform.OS === 'android'}
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.setStrikethrough,
                actions.blockquote,
                actions.alignLeft,
                actions.alignCenter,
                actions.alignRight,
                actions.undo,
                actions.redo,
              ]}
              style={styles.toolbar}
            />
          </View>
        </BlurView>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fabWrapper}
        activeOpacity={0.8}
        onPress={() => handleSave()}
      >
        <BlurView intensity={100} tint={isDark ? "light" : "dark"} style={[styles.fabGlass, !isDark && {borderColor: 'rgba(255,255,255,0.8)'}]}>
          <MaterialIcons name="save" size={28} color={isDark ? "#1E1E2C" : "#fff"} />
        </BlurView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  containerDark: { backgroundColor: '#0F172A' },
  containerLight: { backgroundColor: '#F8FAFC' },
  circle: { position: 'absolute', borderRadius: 300, opacity: 0.5 },
  circle1: { width: 400, height: 400, backgroundColor: '#EC4899', top: -50, left: -150 },
  circle2: { width: 350, height: 350, backgroundColor: '#8B5CF6', bottom: -50, right: -100 },
  scrollArea: { flex: 1 },
  scrollContent: { paddingTop: 100, paddingHorizontal: 16, paddingBottom: 100 },
  glassCard: { borderRadius: 24, padding: 20, overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(0,0,0,0.2)' },
  glassLight: { borderColor: 'rgba(255, 255, 255, 0.6)', backgroundColor: 'rgba(255,255,255,0.3)' },
  titleInput: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)', paddingBottom: 10 },
  textDark: { color: '#fff' },
  textLightTitle: { color: '#1E293B' },
  editorWrapper: { borderRadius: 12, overflow: 'hidden', marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  editor: { minHeight: 300 },
  toolbarWrapper: { borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  toolbar: { backgroundColor: 'rgba(255,255,255,0.95)' },
  fabWrapper: { position: 'absolute', right: 25, bottom: 30, borderRadius: 30, overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  fabGlass: { width: 60, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 30, borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.2)' },
});