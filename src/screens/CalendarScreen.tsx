import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

export default function CalendarScreen({ onNavigate }: { onNavigate?: (screen: string, id?: string) => void }) {
  const { theme, darkMode } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.monthTitle, { color: theme.text }]}>September 2026</Text>
          <View style={styles.navBtns}>
            <TouchableOpacity style={[styles.navBtn, { backgroundColor: theme.itemBg }]}>
              <ChevronLeft size={20} color={theme.subText} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navBtn, { backgroundColor: theme.itemBg }]}>
              <ChevronRight size={20} color={theme.subText} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.calendarGrid}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <View key={`${day}-${index}`} style={styles.dayHeader}>
              <Text style={[styles.dayHeaderText, { color: theme.subText }]}>{day}</Text>
            </View>
          ))}
          {Array.from({ length: 30 }).map((_, i) => {
            const dayNum = i + 1;
            const hasEvent = dayNum === 9 || dayNum === 21 || dayNum === 25;
            return (
              <TouchableOpacity 
                key={i} 
                style={[
                  styles.dayCell,
                  { backgroundColor: theme.itemBg },
                  hasEvent && [styles.dayCellEvent, { backgroundColor: theme.primary, shadowColor: theme.primary }]
                ]}
              >
                <Text style={[
                  styles.dayText,
                  { color: theme.text },
                  hasEvent && styles.dayTextEvent
                ]}>
                  {dayNum}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.eventsSection, { borderTopColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Celebrations this month</Text>
          <View style={[styles.eventCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.eventLeft}>
              <View style={[styles.eventDate, { backgroundColor: darkMode ? theme.itemBg : theme.primary + '15' }]}>
                <Text style={[styles.eventDateText, { color: theme.primary }]}>09</Text>
              </View>
              <View>
                <Text style={[styles.eventName, { color: theme.text }]}>Julia Mason's Birthday</Text>
                <Text style={[styles.eventMeta, { color: theme.subText }]}>Main Event • 7:00 PM</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.detailsBtn, { backgroundColor: theme.itemBg }]}
              onPress={() => onNavigate?.('gift_shop')}
            >
              <Text style={[styles.detailsBtnText, { color: theme.primary }]}>Gift Julia</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: '900',
  },
  navBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  navBtn: {
    padding: 8,
    borderRadius: 12,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayHeader: {
    width: '12.5%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  dayCell: {
    width: '12.5%',
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dayCellEvent: {
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '700',
  },
  dayTextEvent: {
    color: '#fff',
  },
  eventsSection: {
    marginTop: 40,
    paddingTop: 32,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 20,
  },
  eventCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
  },
  eventLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventDate: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDateText: {
    fontSize: 14,
    fontWeight: '900',
  },
  eventName: {
    fontSize: 14,
    fontWeight: '700',
  },
  eventMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  detailsBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  detailsBtnText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
