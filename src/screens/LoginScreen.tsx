import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, ShieldCheck, Mail, LogIn } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { signIn, skipAuth, isSigningIn, error } = useAuth();
  const { theme, darkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Background decoration */}
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={[theme.primary + '20', 'transparent', theme.secondary + '10']}
          style={StyleSheet.absoluteFill}
        />
        <MotiView
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.1, scale: 1.2 }}
          transition={{ loop: true, duration: 4000, type: 'timing' }}
          style={[styles.blob, { backgroundColor: theme.primary, top: -100, left: -50 }]}
        />
        <MotiView
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.05, scale: 1.5 }}
          transition={{ loop: true, duration: 6000, type: 'timing', delay: 1000 }}
          style={[styles.blob, { backgroundColor: theme.secondary, bottom: -150, right: -100, width: 400, height: 400 }]}
        />
      </View>

      <View style={styles.content}>
        <MotiView 
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1000 }}
          style={styles.logoContainer}
        >
          <View style={[styles.iconWrapper, { backgroundColor: theme.primary + '15' }]}>
            <Sparkles size={64} color={theme.primary} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>Celebrate</Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>
            Every moment is worth shared. Connect with friends and celebrate together.
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1000, delay: 300 }}
          style={styles.formContainer}
        >
          {error ? (
            <View style={[styles.errorBox, { backgroundColor: '#fee2e2', borderColor: '#f87171' }]}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: theme.primary }]}
            onPress={signIn}
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <LogIn size={20} color="#fff" />
                <Text style={styles.loginButtonText}>Sign in with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.skipButton, { borderColor: theme.border }]}
            onPress={skipAuth}
          >
            <Text style={[styles.skipButtonText, { color: theme.subText }]}>Skip for now</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.subText }]}>SECURE LOGIN</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <ShieldCheck size={16} color={theme.primary} />
              <Text style={[styles.featureText, { color: theme.subText }]}>Instant & Secure Access</Text>
            </View>
          </View>
        </MotiView>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.subText }]}>
          By continuing, you agree to our Terms and Privacy Policy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 200,
  },
  content: {
    padding: 32,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconWrapper: {
    padding: 24,
    borderRadius: 32,
    marginBottom: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    gap: 16,
  },
  loginButton: {
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  skipButton: {
    height: 56,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  errorBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  featureList: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.6,
  },
});
