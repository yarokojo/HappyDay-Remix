import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, TextInput } from "react-native";
import { ChevronLeft, ChevronRight, Search, Heart, Gift } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";


export default function CalendarScreen({ 
  searchQuery = "",
  onWishClick,
  onGiftClick
}: { 
  searchQuery?: string,
  onWishClick?: (name: string) => void,
  onGiftClick?: () => void
}) {
  const { theme, darkMode } = useTheme();
  const [internalSearch, setInternalSearch] = useState("");

  const events = [
    { id: 1, name: "Julia Mason's Birthday", date: "09", time: "7:00 PM", type: "Main Event" },
    { id: 2, name: "Kevin Hart's Party", date: "21", time: "8:30 PM", type: "Party" },
    { id: 3, name: "Samantha Lee's Surprise", date: "25", time: "6:00 PM", type: "Surprise" },
  ];

  const effectiveSearch = internalSearch || searchQuery;

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
    event.type.toLowerCase().includes(effectiveSearch.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Search size={18} color={theme.subText} />
          <TextInput 
            placeholder="Search events..." 
            style={[styles.searchInput, { color: theme.text }]}
            placeholderTextColor={theme.subText}
            value={internalSearch}
            onChangeText={setInternalSearch}
          />
        </View>

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
          {filteredEvents.length > 0 ? filteredEvents.map((event) => {
            const nameBase = event.name.includes("'") ? event.name.split("'")[0] : event.name;
            return (
              <View key={event.id} style={[styles.eventCard, { backgroundColor: theme.card, borderColor: theme.border, marginBottom: 12 }]}>
                <View style={styles.eventLeft}>
                  <View style={[styles.eventDate, { backgroundColor: darkMode ? theme.itemBg : theme.primary + '15' }]}>
                    <Text style={[styles.eventDateText, { color: theme.primary }]}>{event.date}</Text>
                  </View>
                  <View>
                    <Text style={[styles.eventName, { color: theme.text }]}>{event.name}</Text>
                    <Text style={[styles.eventMeta, { color: theme.subText }]}>{event.type} • {event.time}</Text>
                  </View>
                </View>
                <View style={styles.eventActions}>
                  <TouchableOpacity 
                     onPress={() => onWishClick?.(nameBase)}
                     style={[styles.smallAction, { backgroundColor: theme.itemBg }]}
                  >
                    <Heart size={14} color={theme.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                     onPress={onGiftClick}
                     style={[styles.smallAction, { backgroundColor: theme.itemBg }]}
                  >
                    <Gift size={14} color={darkMode ? theme.secondary : "#ec4899"} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }) : (
            <View style={styles.emptySearch}>
              <Text style={{ color: theme.subText, textAlign: 'center' }}>No celebrations found for "{effectiveSearch}"</Text>
            </View>
          )}
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
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
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
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  smallAction: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  emptySearch: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
