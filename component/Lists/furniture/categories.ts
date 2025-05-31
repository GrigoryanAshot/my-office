export interface Category {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
  order: number;
}

export const categories: Record<string, Category> = {
  "furniture": {
    "id": "furniture",
    "name": "Սեղաններ և աթոռներ",
    "url": "/furniture",
    "imageUrl": "https://i.ibb.co/Q8GzZJJ/3d2c5838-8981-4957-97f3-56589bd32d17.jpg",
    "order": 1
  },
  "furniture_tables": {
    "id": "furniture_tables",
    "name": "Սեղաններ",
    "url": "/furniture/tables",
    "imageUrl": "https://res.cloudinary.com/dpbsyoxw8/image/upload/v1747307810/furniture/ybprp59jimu8hecl6jta.png",
    "order": 2
  },
  "furniture_chairs": {
    "id": "furniture_chairs",
    "name": "Աթոռներ",
    "url": "/furniture/chairs",
    "imageUrl": "https://res.cloudinary.com/dpbsyoxw8/image/upload/v1747305690/furniture/jwxiz8xjhymzqnwtbrms.png",
    "order": 3
  },
  "doors": {
    "id": "doors",
    "name": "Փափուկ կահույք",
    "url": "/doors",
    "imageUrl": "https://i.postimg.cc/CMXsFGdw/1b46b74c-60fd-4f2d-90c4-199f627a9da8.jpg",
    "order": 2
  },
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
  "metal": {
    "id": "metal",
    "name": "Այլ",
    "url": "/metal",
    "imageUrl": "https://i.postimg.cc/7brzSNT7/9b1a5d4391d7cac0867ad309c46f0d08.jpg",
    "order": 4
  },
  "doors_doors_entrance": {
    "id": "doors_doors_entrance",
    "name": "Բազմոցներ",
    "url": "/doors/doors_entrance",
    "imageUrl": "https://i.postimg.cc/CMXsFGdw/1b46b74c-60fd-4f2d-90c4-199f627a9da8.jpg",
    "order": 3
  },
  "doors_doors_metal_plastic": {
    "id": "doors_doors_metal_plastic",
    "name": "Բազկաթոռներ",
    "url": "/doors/doors_metal_plastic",
    "imageUrl": "https://i.postimg.cc/CMXsFGdw/1b46b74c-60fd-4f2d-90c4-199f627a9da8.jpg",
    "order": 4
  },
  "doors_doors_aluminum": {
    "id": "doors_doors_aluminum",
    "name": "Պուֆիկներ",
    "url": "/doors/doors_aluminum",
    "imageUrl": "https://i.postimg.cc/CMXsFGdw/1b46b74c-60fd-4f2d-90c4-199f627a9da8.jpg",
    "order": 5
  },
  "doors_doors_takht": {
    "id": "doors_doors_takht",
    "name": "Թախտեր",
    "url": "/doors/doors_takht",
    "imageUrl": "https://i.postimg.cc/CMXsFGdw/1b46b74c-60fd-4f2d-90c4-199f627a9da8.jpg",
    "order": 8
  },
  "doors_doors_takhtir": {
    "id": "doors_doors_takhtir",
    "name": "Տակդիրներ",
    "url": "/doors/doors_takhtir",
    "imageUrl": "https://i.postimg.cc/CMXsFGdw/1b46b74c-60fd-4f2d-90c4-199f627a9da8.jpg",
    "order": 8
  },
  "doors_doors_sliding": {
    "id": "doors_doors_sliding",
    "name": "Թախտ",
    "url": "/doors/doors_sliding",
    "imageUrl": "https://i.postimg.cc/CMXsFGdw/1b46b74c-60fd-4f2d-90c4-199f627a9da8.jpg",
    "order": 6
  },
  "windows_windows_cabinets": {
    "id": "windows_windows_cabinets",
    "name": "Դարակաշարեր",
    "url": "/windows/windows_cabinets",
    "imageUrl": "https://i.postimg.cc/FF7xrvmd/9b132849cf151713ae4672aac52a0a31.jpg",
    "order": 5
  },
  "windows_windows_kitchen": {
    "id": "windows_windows_kitchen",
    "name": "Տումբաներ և կոմոդներ",
    "url": "/windows/windows_kitchen",
    "imageUrl": "https://i.postimg.cc/FF7xrvmd/9b132849cf151713ae4672aac52a0a31.jpg",
    "order": 6
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
