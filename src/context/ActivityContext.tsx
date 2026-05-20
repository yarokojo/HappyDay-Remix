import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Notification } from "../types";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";

interface HistoryItem {
  id: string;
  type: 'video' | 'image' | 'story';
  title: string;
  imageUrl: string;
  timestamp: string;
}

interface SavedItem {
  id: string;
  type: 'video' | 'post';
  title: string;
  imageUrl: string;
  timestamp: string;
}

interface ActivityContextType {
  notifications: Notification[];
  history: HistoryItem[];
  savedItems: SavedItem[];
  addNotification: (notif: Omit<Notification, 'id' | 'time' | 'isRead'>, recipientId?: string) => void;
  markAsRead: (id: string) => void;
  logView: (item: Omit<HistoryItem, 'timestamp'>) => void;
  saveForLater: (item: Omit<SavedItem, 'timestamp'>) => void;
  removeFromSaved: (id: string) => void;
  clearHistory: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setHistory([]);
      setSavedItems([]);
      return;
    }

    const fetchActivity = async () => {
      if (user.uid.startsWith('guest_')) {
        // Load from local storage for guests
        const localNotifs = localStorage.getItem('guest_notifications');
        const localHistory = localStorage.getItem('guest_history');
        const localSaved = localStorage.getItem('guest_saved');

        if (localNotifs) setNotifications(JSON.parse(localNotifs));
        if (localHistory) setHistory(JSON.parse(localHistory));
        if (localSaved) setSavedItems(JSON.parse(localSaved));
        return;
      }

      // Fetch Notifications
      const { data: notifData } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', user.uid)
        .order('created_at', { ascending: false });

      if (notifData) {
        setNotifications(notifData.map(item => ({
          id: item.id,
          ...item,
          recipientId: item.recipient_id,
          isRead: item.is_read,
          time: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"
        } as Notification)));
      }

      // Fetch History
      const { data: historyData } = await supabase
        .from('history')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false })
        .limit(50);

      if (historyData) {
        setHistory(historyData.map(item => ({
          id: item.item_id,
          type: item.type,
          title: item.title,
          imageUrl: item.image_url,
          timestamp: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      }

      // Fetch Saved
      const { data: savedData } = await supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });

      if (savedData) {
        setSavedItems(savedData.map(item => ({
          id: item.item_id,
          type: item.type,
          title: item.title,
          imageUrl: item.image_url,
          timestamp: "Saved " + new Date(item.created_at).toLocaleDateString()
        })));
      }
    };

    fetchActivity();

    const subscription = supabase
      .channel('activity-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications', 
        filter: `recipient_id=eq.${user.uid}` 
      }, () => fetchActivity())
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const addNotification = async (notif: Omit<Notification, 'id' | 'time' | 'isRead'>, recipientId?: string) => {
    const targetId = recipientId || user?.uid || "julia_mason"; 
    
    if (user?.uid.startsWith('guest_')) {
      const newNotif: Notification = {
        ...notif,
        id: Math.random().toString(36).substr(2, 9),
        recipientId: targetId,
        isRead: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const updated = [newNotif, ...notifications];
      setNotifications(updated);
      localStorage.setItem('guest_notifications', JSON.stringify(updated));
      return;
    }

    try {
      const { error } = await supabase.from('notifications').insert({
        ...notif,
        recipient_id: targetId,
        is_read: false,
        created_at: new Date().toISOString()
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  const markAsRead = async (id: string) => {
    if (user?.uid.startsWith('guest_')) {
      const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
      setNotifications(updated);
      localStorage.setItem('guest_notifications', JSON.stringify(updated));
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const logView = async (item: Omit<HistoryItem, 'timestamp'>) => {
    if (!user) return;

    if (user.uid.startsWith('guest_')) {
      const newEntry: HistoryItem = {
        ...item,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const updated = [newEntry, ...history.filter(h => h.id !== item.id)].slice(0, 50);
      setHistory(updated);
      localStorage.setItem('guest_history', JSON.stringify(updated));
      return;
    }

    try {
      const { error } = await supabase.from('history').upsert({
        user_id: user.uid,
        item_id: item.id,
        type: item.type,
        title: item.title,
        image_url: item.imageUrl,
        created_at: new Date().toISOString()
      }, { onConflict: 'user_id,item_id' });
      
      if (error) throw error;
      
      const newEntry: HistoryItem = {
        ...item,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [newEntry, ...prev.filter(h => h.id !== item.id)].slice(0, 50));
    } catch (error) {
      console.error("Error logging view:", error);
    }
  };

  const saveForLater = async (item: Omit<SavedItem, 'timestamp'>) => {
    if (!user) return;

    if (user.uid.startsWith('guest_')) {
      const newSave: SavedItem = {
        ...item,
        timestamp: "Saved " + new Date().toLocaleDateString()
      };
      if (savedItems.find(p => p.id === item.id)) return;
      const updated = [newSave, ...savedItems];
      setSavedItems(updated);
      localStorage.setItem('guest_saved', JSON.stringify(updated));
      return;
    }

    try {
      const { error } = await supabase.from('saved_items').upsert({
        user_id: user.uid,
        item_id: item.id,
        type: item.type,
        title: item.title,
        image_url: item.imageUrl,
        created_at: new Date().toISOString()
      }, { onConflict: 'user_id,item_id' });

      if (error) throw error;

      const newSave: SavedItem = {
        ...item,
        timestamp: "Saved " + new Date().toLocaleDateString()
      };
      setSavedItems(prev => {
        if (prev.find(p => p.id === item.id)) return prev;
        return [newSave, ...prev];
      });
    } catch (error) {
      console.error("Error saving for later:", error);
    }
  };

  const removeFromSaved = async (id: string) => {
    if (!user) return;

    if (user.uid.startsWith('guest_')) {
      const updated = savedItems.filter(p => p.id !== id);
      setSavedItems(updated);
      localStorage.setItem('guest_saved', JSON.stringify(updated));
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_items')
        .delete()
        .eq('user_id', user.uid)
        .eq('item_id', id);
      
      if (error) throw error;
      setSavedItems(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error removing from saved:", error);
    }
  };

  const clearHistory = async () => {
    if (!user) return;

    if (user.uid.startsWith('guest_')) {
      setHistory([]);
      localStorage.removeItem('guest_history');
      return;
    }

    try {
      const { error } = await supabase
        .from('history')
        .delete()
        .eq('user_id', user.uid);
      if (error) throw error;
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  return (
    <ActivityContext.Provider value={{ 
      notifications, 
      history, 
      savedItems, 
      addNotification, 
      markAsRead, 
      logView, 
      saveForLater, 
      removeFromSaved,
      clearHistory 
    }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
}
