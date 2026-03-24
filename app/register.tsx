import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { api } from '../services/api';
import { useThemeContext } from '../hooks/useThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function RegisterScreen() {
  const router = useRouter();
  const { isDark } = useThemeContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });

  const handleRegister = async () => {
    let valid = true;
    let newErrors = { username: '', password: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) { newErrors.username = 'El username debe ser un correo electrónico válido.'; valid = false; }
    if (password.length < 8) { newErrors.password = 'La contraseña debe tener un mínimo de 8 caracteres.'; valid = false; }
    setErrors(newErrors);

    if (valid) {
      setLoading(true);
      try {
        await api.register(username, password);
        Alert.alert('Éxito', 'Cuenta registrada correctamente', [{ text: 'Ir a Iniciar Sesión', onPress: () => router.replace('/login') }]);
      } catch (err) {
        Alert.alert('Error', 'No se pudo registrar la cuenta. Puede que ya exista.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <ThemeToggle absolute />

      <View style={[styles.circle, styles.circle1, !isDark && {opacity: 0.3}]} />
      <View style={[styles.circle, styles.circle2, !isDark && {opacity: 0.3}]} />

      <BlurView intensity={100} tint={isDark ? "dark" : "light"} style={[styles.glassContainer, !isDark && styles.glassLight]}>
        <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>Registro</Text>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>Correo Electrónico</Text>
          <TextInput
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="correo@ejemplo.com"
            placeholderTextColor={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
          />
          {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>Contraseña</Text>
          <TextInput
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Crear Cuenta</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/login')} style={styles.linkButton}>
          <Text style={[styles.linkText, !isDark && {color: '#D946EF'}]}>¿Ya tienes cuenta? Inicia Sesión</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  containerDark: { backgroundColor: '#0F172A' },
  containerLight: { backgroundColor: '#F8FAFC' },
  circle: { position: 'absolute', borderRadius: 200 },
  circle1: { width: 350, height: 350, backgroundColor: '#EC4899', top: -80, right: -100, opacity: 0.6 },
  circle2: { width: 300, height: 300, backgroundColor: '#8B5CF6', bottom: -50, left: -100, opacity: 0.6 },
  glassContainer: { width: '85%', padding: 30, borderRadius: 28, overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(0,0,0,0.1)' },
  glassLight: { borderColor: 'rgba(255, 255, 255, 0.6)', backgroundColor: 'rgba(255,255,255,0.3)' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  textLight: { color: '#1E293B' },
  textDark: { color: '#fff', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  inputContainer: { marginBottom: 20 },
  label: { marginBottom: 8, fontSize: 14, fontWeight: '500' },
  input: { borderRadius: 12, padding: 15, fontSize: 16, borderWidth: 1 },
  inputDark: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', borderColor: 'rgba(255, 255, 255, 0.15)' },
  inputLight: { backgroundColor: 'rgba(255, 255, 255, 0.6)', color: '#1E293B', borderColor: 'rgba(255, 255, 255, 0.8)' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 6 },
  button: { backgroundColor: 'rgba(236, 72, 153, 0.8)', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  linkButton: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#F3E8FF', fontSize: 15, fontWeight: '500' },
});
