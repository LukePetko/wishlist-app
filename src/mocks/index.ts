import { wishlistOrders } from '@/drizzle/schema';

type MockItem = {
  id: string;
  orders: (typeof wishlistOrders.$inferSelect)[];
};

export const mockOrders = [
  {
    id: 'c34ac747-a18e-4d6f-87bc-2ed69c19f455',
    orders: [],
  },
  {
    id: '8c469478-8ab4-4124-a2ba-0d8c6cea4856',
    orders: [
      {
        id: '9c426282-297d-4a63-b0c8-0711156cf27d',
        itemId: '8c469478-8ab4-4124-a2ba-0d8c6cea4856',
        isOrdered: true,
      },
    ],
  },
  {
    id: '09ded324-5c26-41dd-9931-6215172a401d',
    orders: [],
  },
  {
    id: 'ae351ae9-d133-47f9-bc76-e1217bd0eba0',
    orders: [],
  },
  {
    id: 'b4e83b03-cdbc-4b66-8dbe-b135b8a3633b',
    orders: [],
  },
  {
    id: 'b2981212-2289-45a3-8484-c8e9120e7157',
    orders: [
      {
        id: '26b52e51-d56b-4e7a-911b-90f91d6fbef4',
        itemId: 'b2981212-2289-45a3-8484-c8e9120e7157',
        isOrdered: true,
        note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et arcu in dolor vulputate convallis quis ut ligula. Sed lobortis.',
      },
    ],
  },
  {
    id: '6af5b4a1-7c39-47a2-8327-f05ad31b57ca',
    orders: [
      {
        id: '2d4a229d-bd9b-490c-b266-fe7d95b122a6',
        itemId: '6af5b4a1-7c39-47a2-8327-f05ad31b57ca',
        isOrdered: true,
        note: 'UwU',
      },
    ],
  },
  {
    id: '8b5b9446-1ec1-48dd-a124-a4ed5e4806b7',
    orders: [],
  },
  {
    id: '92cbf2da-f0f7-4103-a583-9f550f1de7b9',
    orders: [],
  },
] as MockItem[];
