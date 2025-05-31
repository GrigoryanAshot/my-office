export interface Category {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
  order: number;
}

export const categories: Record<string, Category> = {
  "doors": {
    "id": "doors",
    "name": "Փափուկ կահույք",
    "url": "/doors",
    "imageUrl": "https://i.postimg.cc/CMXsFGdw/1b46b74c-60fd-4f2d-90c4-199f627a9da8.jpg",
    "order": 2
  },
  "doors_entrance": {
    "id": "doors_entrance",
    "name": "Մուտքի դռներ",
    "url": "/doors/entrance",
    "imageUrl": "https://i.postimg.cc/CMXsFGdw/1b46b74c-60fd-4f2d-90c4-199f627a9da8.jpg",
    "order": 3
  },
  "doors_metal_plastic": {
    "id": "doors_metal_plastic",
    "name": "Մետաղապլաստե դռներ",
    "url": "/doors/metal-plastic",
    "imageUrl": "https://i.postimg.cc/CMXsFGdw/1b46b74c-60fd-4f2d-90c4-199f627a9da8.jpg",
    "order": 4
  },
  "doors_aluminum": {
    "id": "doors_aluminum",
    "name": "Ալյումինե դռներ",
    "url": "/doors/aluminum",
    "imageUrl": "https://i.postimg.cc/CMXsFGdw/1b46b74c-60fd-4f2d-90c4-199f627a9da8.jpg",
    "order": 5
  },
  "doors_sliding": {
    "id": "doors_sliding",
    "name": "Սահող դռներ",
    "url": "/doors/sliding",
    "imageUrl": "https://i.postimg.cc/CMXsFGdw/1b46b74c-60fd-4f2d-90c4-199f627a9da8.jpg",
    "order": 6
  }
}; 