export type FileType = 'folder' | 'text' | 'image' | 'project';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  icon?: string;
  content?: string;
  children?: FileItem[];
  url?: string;
  technologies?: string[];
  description?: string;
  imagePath?: string; // For project screenshots or folder icons
}

export interface WindowState {
  id: string;
  title: string;
  content: React.ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  imagePath?: string;
}
