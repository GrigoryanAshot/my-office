export interface Category {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
  order: number;
}

export const categories: Record<string, Category> = {
  "windows": {
    "id": "windows",
    "name": "Պահարաններ և ավելին",
    "url": "/windows",
    "imageUrl": "https://i.postimg.cc/FF7xrvmd/9b132849cf151713ae4672aac52a0a31.jpg",
    "order": 3
  },
  "windows_wardrobes": {
    "id": "windows_wardrobes",
    "name": "Պահարաններ",
    "url": "/windows/wardrobes",
    "imageUrl": "https://i.postimg.cc/FF7xrvmd/9b132849cf151713ae4672aac52a0a31.jpg",
    "order": 4
  },
  "windows_cabinets": {
    "id": "windows_cabinets",
    "name": "Դարակներ",
    "url": "/windows/cabinets",
    "imageUrl": "https://i.postimg.cc/FF7xrvmd/9b132849cf151713ae4672aac52a0a31.jpg",
    "order": 5
  },
  "windows_kitchen": {
    "id": "windows_kitchen",
    "name": "Խոհանոցի կահույք",
    "url": "/windows/kitchen",
    "imageUrl": "https://i.postimg.cc/FF7xrvmd/9b132849cf151713ae4672aac52a0a31.jpg",
    "order": 6
  }
}; 