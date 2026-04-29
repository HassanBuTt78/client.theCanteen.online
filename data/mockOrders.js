// app/data/mockOrders.js
export const mockOrders = [
  {
    id: 'ORD-1001',
    items: [
      { id: '1', name: 'Samosa Chaat', quantity: 2, price: 150 },
      { id: '4', name: 'Karak Chai', quantity: 2, price: 80 }
    ],
    totalAmount: 460,
    status: 'Pending',
    pickupTime: '10:15 AM',
    placedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
  },
  {
    id: 'ORD-1002',
    items: [
      { id: '7', name: 'Chicken Biryani', quantity: 1, price: 450 },
      { id: '6', name: 'Mint Margarita', quantity: 1, price: 200 }
    ],
    totalAmount: 650,
    status: 'Preparing',
    pickupTime: '12:30 PM',
    placedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
  },
  {
    id: 'ORD-1003',
    items: [
      { id: '2', name: 'Chicken Roll', quantity: 1, price: 250 }
    ],
    totalAmount: 250,
    status: 'Ready for Pickup',
    pickupTime: '01:00 PM',
    placedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: 'ORD-0999',
    items: [
      { id: '9', name: 'Zinger Burger', quantity: 2, price: 350 },
      { id: '3', name: 'French Fries', quantity: 1, price: 100 }
    ],
    totalAmount: 800,
    status: 'Completed',
    pickupTime: 'Yesterday, 2:00 PM',
    placedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'ORD-0998',
    items: [
      { id: '10', name: 'Chocolate Brownie', quantity: 3, price: 180 }
    ],
    totalAmount: 540,
    status: 'Cancelled',
    pickupTime: 'Yesterday, 11:00 AM',
    placedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  }
];
