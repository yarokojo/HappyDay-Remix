import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export default function TermsAndConditionsScreen({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Terms & Conditions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.lastUpdated, { color: theme.subText }]}>Last Updated: May 12, 2026</Text>
        
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Julia's Birthday Bash ("we," "us" or "our"), concerning your access to and use of our application.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Acceptance of Terms</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          By accessing or using our application, you agree that you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these terms, then you are expressly prohibited from using the App and you must discontinue use immediately.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>2. User Representations</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          By using the App, you represent and warrant that:
          {"\n"}• All registration information you submit will be true, accurate, current, and complete.
          {"\n"}• You will maintain the accuracy of such information and promptly update such registration information as necessary.
          {"\n"}• You have the legal capacity and you agree to comply with these Terms and Conditions.
          {"\n"}• You are not a minor in the jurisdiction in which you reside.
          {"\n"}• You will not access the App through automated or non-human means, whether through a bot, script or otherwise.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>3. User Accounts</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          You may be required to register with the App. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>4. Prohibited Activities</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          You may not access or use the App for any purpose other than that for which we make the App available. The App may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
          {"\n"}Systematic retrieval of data or other content from the App to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us is prohibited.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>5. Payments and Purchases</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          We accept the following forms of payment: Mobile Money and Credit Cards via our third-party processors. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the App.
          {"\n"}You agree to pay all charges at the prices then in effect for your purchases and any applicable fees (including the 1% maintenance fee for transactions), and you authorize us to charge your chosen payment provider for any such amounts upon placing your order.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>6. Wallet Transactions</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          The Wallet feature allows users to store and transfer funds for use within the App. We are not a bank, and funds stored in your wallet are not insured deposits. We reserve the right to freeze or terminate your wallet access if we suspect fraudulent activity.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>7. Intellectual Property Rights</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          Unless otherwise indicated, the App is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the App (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>8. Limitation of Liability</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the App.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>9. Contact Us</Text>
        <Text style={[styles.paragraph, { color: theme.subText }]}>
          In order to resolve a complaint regarding the App or to receive further information regarding use of the App, please contact us at terms@juliabash.com.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 14,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
});
