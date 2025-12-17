export interface Category {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
  order: number;
}

export const categories: Record<string, Category> = {
  "metal": {
    "id": "metal",
    "name": "Այլ",
    "url": "/metal",
    "imageUrl": "https://res.cloudinary.com/dpbsyoxw8/image/upload/v1747646123/furniture/metal.png",
    "order": 4
  },
  "metal_wall_decor": {
    "id": "metal_wall_decor",
    "name": "Պատի դեկորներ",
    "url": "/metal/wall-decor",
    "imageUrl": "https://res.cloudinary.com/dpbsyoxw8/image/upload/v1747646123/furniture/wall-decor.png",
    "order": 5
  },
  "metal_hangers": {
    "id": "metal_hangers",
    "name": "Կախիչներ",
    "url": "/metal/hangers",
    "imageUrl": "https://res.cloudinary.com/dpbsyoxw8/image/upload/v1747646123/furniture/hangers.png",
    "order": 6
  },
  "metal_podium": {
    "id": "metal_podium",
    "name": "Ամբիոն",
    "url": "/metal/podium",
    "imageUrl": "https://res.cloudinary.com/dpbsyoxw8/image/upload/v1747646123/furniture/podium.png",
    "order": 7
  }
}; 