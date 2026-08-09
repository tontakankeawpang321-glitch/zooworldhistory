export interface Documentary {
  id: string;
  category: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  videoId: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  linkUrl: string;
  category?: string;
}

export type ActiveTab = 'home' | 'favorites' | 'knowledge';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}
