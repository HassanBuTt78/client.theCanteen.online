export const adminOrders = [
  {
    id: 'ORD-1015',
    studentName: 'Ali Khan',
    rollNumber: '2023-CS-042',
    items: [
      { id: '1', name: 'Samosa Chaat', quantity: 2, price: 150 },
      { id: '4', name: 'Karak Chai', quantity: 2, price: 80 }
    ],
    totalAmount: 460,
    status: 'Pending',
    pickupTime: '10:15 AM',
    placedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: 'ORD-1014',
    studentName: 'Sara Ahmed',
    rollNumber: '2022-EE-112',
    items: [
      { id: '7', name: 'Chicken Biryani', quantity: 1, price: 450 },
      { id: '6', name: 'Mint Margarita', quantity: 1, price: 200 }
    ],
    totalAmount: 650,
    status: 'Pending',
    pickupTime: '12:30 PM',
    placedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'ORD-1013',
    studentName: 'Zainab Fatima',
    rollNumber: '2021-BBA-089',
    items: [
      { id: '2', name: 'Chicken Roll', quantity: 3, price: 250 }
    ],
    totalAmount: 750,
    status: 'Pending',
    pickupTime: '11:00 AM',
    placedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: 'ORD-1012',
    studentName: 'Omar Farooq',
    rollNumber: '2024-SE-011',
    items: [
      { id: '10', name: 'Chocolate Brownie', quantity: 1, price: 180 },
      { id: '5', name: 'Cold Coffee', quantity: 1, price: 300 }
    ],
    totalAmount: 480,
    status: 'Pending',
    pickupTime: '02:00 PM',
    placedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'ORD-1011',
    studentName: 'Hassan Ali',
    rollNumber: '2023-ME-055',
    items: [
      { id: '8', name: 'Lentils (Daal Chawal)', quantity: 1, price: 250 }
    ],
    totalAmount: 250,
    status: 'Confirmed',
    pickupTime: '01:00 PM',
    placedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'ORD-1010',
    studentName: 'Ayesha Raza',
    rollNumber: '2022-CS-099',
    items: [
      { id: '9', name: 'Zinger Burger', quantity: 2, price: 350 },
      { id: '3', name: 'French Fries', quantity: 1, price: 100 }
    ],
    totalAmount: 800,
    status: 'Confirmed',
    pickupTime: '12:45 PM',
    placedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 'ORD-1009',
    studentName: 'Bilal Tariq',
    rollNumber: '2021-EE-005',
    items: [
      { id: '11', name: 'Gulab Jamun (2 pcs)', quantity: 2, price: 120 }
    ],
    totalAmount: 240,
    status: 'Preparing',
    pickupTime: '01:15 PM',
    placedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'ORD-1008',
    studentName: 'Khadija Usman',
    rollNumber: '2023-BBA-120',
    items: [
      { id: '7', name: 'Chicken Biryani', quantity: 2, price: 450 }
    ],
    totalAmount: 900,
    status: 'Preparing',
    pickupTime: '12:30 PM',
    placedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'ORD-1007',
    studentName: 'Hamza Nadeem',
    rollNumber: '2024-CS-022',
    items: [
      { id: '4', name: 'Karak Chai', quantity: 1, price: 80 }
    ],
    totalAmount: 80,
    status: 'Ready for Pickup',
    pickupTime: '10:30 AM',
    placedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'ORD-1006',
    studentName: 'Fatima Zafar',
    rollNumber: '2022-SE-076',
    items: [
      { id: '5', name: 'Cold Coffee', quantity: 2, price: 300 }
    ],
    totalAmount: 600,
    status: 'Ready for Pickup',
    pickupTime: '11:00 AM',
    placedAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
  },
  {
    id: 'ORD-1005',
    studentName: 'Saad Mahmood',
    rollNumber: '2021-ME-034',
    items: [
      { id: '2', name: 'Chicken Roll', quantity: 1, price: 250 },
      { id: '6', name: 'Mint Margarita', quantity: 1, price: 200 }
    ],
    totalAmount: 450,
    status: 'Completed',
    pickupTime: '09:30 AM',
    placedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'ORD-1004',
    studentName: 'Mariam Ali',
    rollNumber: '2023-CS-088',
    items: [
      { id: '1', name: 'Samosa Chaat', quantity: 1, price: 150 }
    ],
    totalAmount: 150,
    status: 'Completed',
    pickupTime: '09:00 AM',
    placedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'ORD-1003',
    studentName: 'Ahsan Qureshi',
    rollNumber: '2022-BBA-045',
    items: [
      { id: '9', name: 'Zinger Burger', quantity: 1, price: 350 }
    ],
    totalAmount: 350,
    status: 'Completed',
    pickupTime: '08:45 AM',
    placedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
  },
  {
    id: 'ORD-1002',
    studentName: 'Zoya Imran',
    rollNumber: '2024-EE-009',
    items: [
      { id: '3', name: 'French Fries', quantity: 2, price: 100 }
    ],
    totalAmount: 200,
    status: 'Cancelled',
    pickupTime: '10:00 AM',
    placedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'ORD-1001',
    studentName: 'Fahad Riaz',
    rollNumber: '2021-CS-101',
    items: [
      { id: '12', name: 'Ice Cream Cup', quantity: 1, price: 150 }
    ],
    totalAmount: 150,
    status: 'Cancelled',
    pickupTime: '11:15 AM',
    placedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
  }
];
