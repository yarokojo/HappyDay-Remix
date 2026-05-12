import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { ArrowLeft, Share2, RotateCcw } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

interface WebViewScreenProps {
  url: string;
  title?: string;
  onBack: () => void;
}

export default function WebViewScreen({ url, title, onBack }: WebViewScreenProps) {
  const { theme } = useTheme();
  const webViewRef = React.useRef<WebView>(null);

  const handleRefresh = () => {
    webViewRef.current?.reload();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <SafeAreaView style={[styles.header, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{title || 'Preview'}</Text>
          <Text style={[styles.subtitle, { color: theme.subText }]} numberOfLines={1}>{url}</Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={styles.actionBtn}>
          <RotateCcw size={20} color={theme.subText} />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.content}>
        {Platform.OS === 'web' ? (
          <iframe 
            src={url} 
            style={{ width: '100%', height: '100%', border: 'none', backgroundColor: theme.bg }} 
            title="web-preview"
          />
        ) : (
          <WebView 
            ref={webViewRef}
            source={{ uri: url }} 
            style={[styles.webview, { backgroundColor: theme.bg }]}
            startInLoadingState={true}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fff',
  },
  backBtn: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  actionBtn: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
