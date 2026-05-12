import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Notification } from "../types";
import { useAuth } from "./AuthContext";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

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
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: Notification[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          time: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"
        } as Notification;
      });
      setNotifications(notifs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "notifications");
    });

    return () => unsubscribe();
  }, [user]);

  const addNotification = async (notif: Omit<Notification, 'id' | 'time' | 'isRead'>, recipientId?: string) => {
    // If no recipientId, assume it's for Julia (hardcoded for now or use user.uid as self-notif)
    const targetId = recipientId || user?.uid || "julia_mason"; 
    
    try {
      await addDoc(collection(db, "notifications"), {
        ...notif,
        recipientId: targetId,
        isRead: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "notifications");
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const notifRef = doc(db, "notifications", id);
      await updateDoc(notifRef, { isRead: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `notifications/${id}`);
    }
  };

  const logView = (item: Omit<HistoryItem, 'timestamp'>) => {
    const newEntry: HistoryItem = {
      ...item,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setHistory(prev => [newEntry, ...prev.filter(h => h.id !== item.id)].slice(0, 50));
  };

  const saveForLater = (item: Omit<SavedItem, 'timestamp'>) => {
    const newSave: SavedItem = {
      ...item,
      timestamp: "Saved " + new Date().toLocaleDateString()
    };
    setSavedItems(prev => {
      if (prev.find(p => p.id === item.id)) return prev;
      return [newSave, ...prev];
    });
  };

  const removeFromSaved = (id: string) => {
    setSavedItems(prev => prev.filter(p => p.id !== id));
  };

  const clearHistory = () => setHistory([]);

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
