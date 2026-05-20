import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Cake, Calendar, ArrowRight } from 'lucide-react-native';
import { MotiView } from 'moti';

export default function SetBirthdayScreen() {
  const { updateBirthDate } = useAuth();
  const { theme } = useTheme();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!day || !month || !year) {
      setError('Please fill in all fields');
      return;
    }

    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    if (isNaN(d) || d < 1 || d > 31) { setError('Invalid day'); return; }
    if (isNaN(m) || m < 1 || m > 12) { setError('Invalid month'); return; }
    if (isNaN(y) || y < 1900 || y > new Date().getFullYear()) { setError('Invalid year'); return; }

    setError(null);
    setIsLoading(true);
    try {
      // Format as YYYY-MM-DD
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      await updateBirthDate(formattedDate);
    } catch (err) {
      setError('Failed to save birthday. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <MotiView 
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '15' }]}>
          <Cake size={40} color={theme.primary} />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>When's your birthday?</Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>
          We'll use this to celebrate you with your friends and show you relevant content.
        </Text>

        <View style={styles.inputsContainer}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.subText }]}>Day</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.itemBg, borderColor: theme.border }]}>
              <select 
                value={day} 
                onChange={(e) => setDay(e.target.value)}
                style={{ ...styles.select, color: theme.text, backgroundColor: 'transparent' }}
              >
                <option value="">DD</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
                ))}
              </select>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.subText }]}>Month</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.itemBg, borderColor: theme.border }]}>
              <select 
                value={month} 
                onChange={(e) => setMonth(e.target.value)}
                style={{ ...styles.select, color: theme.text, backgroundColor: 'transparent' }}
              >
                <option value="">MM</option>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                  <option key={i + 1} value={String(i + 1)}>{m}</option>
                ))}
              </select>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.subText }]}>Year</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.itemBg, borderColor: theme.border }]}>
              <select 
                value={year} 
                onChange={(e) => setYear(e.target.value)}
                style={{ ...styles.select, color: theme.text, backgroundColor: 'transparent' }}
              >
                <option value="">YYYY</option>
                {Array.from({ length: 100 }, (_, i) => {
                  const y = new Date().getFullYear() - i;
                  return <option key={y} value={String(y)}>{y}</option>;
                })}
              </select>
            </View>
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonText}>Start Celebrating</Text>
              <ArrowRight size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  inputsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 24,
  },
  inputGroup: {
    flex: 1,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  inputWrapper: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  select: {
    width: '100%',
    fontSize: 16,
    fontWeight: '600',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        borderStyle: 'none',
        cursor: 'pointer',
        backgroundColor: 'transparent',
      }
    })
  },
  button: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  }
});
