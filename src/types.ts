export interface Celebrant {
  id: string;
  name: string;
  age: number;
  date: string;
  imageUrl?: string;
  color?: string;
}

export interface Story {
  id: string;
  userName: string;
  imageUrl?: string;
  contentUrl?: string; // Full screen content
  isVideo?: boolean;
  isUser?: boolean;
  color?: string;
  timestamp?: string;
}

export interface Gift {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorImage: string;
  content: string;
  timestamp: string;
  isOwn?: boolean;
}

export interface ReelItem {
  id: string;
  user: string;
  handle: string;
  avatar: string;
  description: string;
  music: string;
  likes: string;
  comments: string;
  videoUrl: string;
  poster: string;
  isBirthday?: boolean;
}

export interface TrendingCeleb {
  id: string;
  name: string;
  handle: string;
  imageUrl: string;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  authorName: string;
  authorHandle: string;
  authorImage: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  reposts: number;
  views: number;
  image?: string;
  video?: string;
  location?: string;
  celebrationType?: 'birthday' | 'anniversary' | 'party' | 'general';
  celebrantName?: string;
  feeling?: string;
  tags?: string[];
  commentsList?: Comment[];
  isEdited?: boolean;
  isFollowed?: boolean;
  isBookmarked?: boolean;
}

export interface GroupGift {
  id: string;
  celebrantName: string;
  giftName: string;
  targetAmount: number;
  currentAmount: number;
  contributorsCount: number;
  deadline: string;
  imageUrl: string;
}

export interface Transaction {
  id: string;
  type: 'gift_received' | 'withdrawal';
  amount: number;
  date: string;
  senderName?: string;
  status: 'completed' | 'pending';
}
