import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Dimensions
} from 'react-native';
import { Lock, Mail, User, Calendar, ArrowRight, Github } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { MotiView, AnimatePresence } from 'moti';

const { width } = Dimensions.get('window');

interface AuthScreenProps {
  onLogin: (userData: { name: string; email: string; birthday: string }) => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const { theme } = useTheme();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      onLogin({
        name: mode === 'signup' ? name : 'Alex Johnson',
        email,
        birthday: mode === 'signup' ? birthday : '1998-05-15',
      });
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.card }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MotiView 
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.logoContainer}
        >
          <View style={[styles.logoIcon, { backgroundColor: theme.primary }]}>
            <Lock color="#fff" size={32} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>
            {mode === 'login' ? 'Continue your journey with us' : 'Join our community today'}
          </Text>
        </MotiView>

        <View style={styles.form}>
          <AnimatePresence exitBeforeEnter>
            {mode === 'signup' && (
              <MotiView
                from={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -20 }}
                key="name-input"
              >
                <View style={[styles.inputWrapper, { backgroundColor: theme.itemBg, borderColor: theme.border }]}>
                  <User size={20} color={theme.subText} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Full Name"
                    placeholderTextColor={theme.subText}
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={[styles.inputWrapper, { backgroundColor: theme.itemBg, borderColor: theme.border }]}>
                  <Calendar size={20} color={theme.subText} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Birthdate (YYYY-MM-DD)"
                    placeholderTextColor={theme.subText}
                    value={birthday}
                    onChangeText={setBirthday}
                  />
                </View>
              </MotiView>
            )}
          </AnimatePresence>

          <View style={[styles.inputWrapper, { backgroundColor: theme.itemBg, borderColor: theme.border }]}>
            <Mail size={20} color={theme.subText} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Email Address"
              placeholderTextColor={theme.subText}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={[styles.inputWrapper, { backgroundColor: theme.itemBg, borderColor: theme.border }]}>
            <Lock size={20} color={theme.subText} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Password"
              placeholderTextColor={theme.subText}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {mode === 'login' && (
            <TouchableOpacity style={styles.forgotPass}>
              <Text style={{ color: theme.primary, fontWeight: '600' }}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.mainButton, { backgroundColor: theme.primary }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.buttonText}>Processing...</Text>
            ) : (
              <>
                <Text style={styles.buttonText}>
                  {mode === 'login' ? 'Sign In' : 'Register'}
                </Text>
                <ArrowRight size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.line, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.subText }]}>OR CONTINUE WITH</Text>
            <View style={[styles.line, { backgroundColor: theme.border }]} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: theme.itemBg, borderColor: theme.border }]}>
              <Github size={20} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: theme.itemBg, borderColor: theme.border }]}>
              <View style={[styles.googleIcon, { backgroundColor: '#db4437' }]} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.toggleMode}
          onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
        >
          <Text style={{ color: theme.subText }}>
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <Text style={{ color: theme.primary, fontWeight: '700' }}>
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  mainButton: {
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  line: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '900',
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialBtn: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  toggleMode: {
    marginTop: 40,
    paddingBottom: 40,
  }
});
