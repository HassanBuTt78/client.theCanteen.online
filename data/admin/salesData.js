export const salesData = {
  weeklyData: {
    totalRevenue: 104500,
    totalOrders: 420,
    avgOrderValue: 248,
    completionRate: '93%',
    dailyBreakdown: [
      { day: 'Mon', revenue: 14000, orders: 55 },
      { day: 'Tue', revenue: 15500, orders: 62 },
      { day: 'Wed', revenue: 13800, orders: 58 },
      { day: 'Thu', revenue: 16200, orders: 65 },
      { day: 'Fri', revenue: 18500, orders: 75 },
      { day: 'Sat', revenue: 14500, orders: 55 },
      { day: 'Sun', revenue: 12000, orders: 50 },
    ],
    topItems: [
      { name: 'Chicken Biryani', quantitySold: 120, revenue: 54000 },
      { name: 'Zinger Burger', quantitySold: 95, revenue: 33250 },
      { name: 'Karak Chai', quantitySold: 210, revenue: 16800 },
      { name: 'Chicken Roll', quantitySold: 85, revenue: 21250 },
      { name: 'Samosa Chaat', quantitySold: 110, revenue: 16500 },
    ],
    ordersByStatus: {
      completed: 390,
      cancelled: 30
    }
  },
  todayData: {
    totalRevenue: 18500,
    totalOrders: 75,
    avgOrderValue: 246,
    completionRate: '95%',
    dailyBreakdown: [
      { day: 'Mon', revenue: 0, orders: 0 },
      { day: 'Tue', revenue: 0, orders: 0 },
      { day: 'Wed', revenue: 0, orders: 0 },
      { day: 'Thu', revenue: 0, orders: 0 },
      { day: 'Fri', revenue: 18500, orders: 75 },
      { day: 'Sat', revenue: 0, orders: 0 },
      { day: 'Sun', revenue: 0, orders: 0 },
    ],
    topItems: [
      { name: 'Zinger Burger', quantitySold: 22, revenue: 7700 },
      { name: 'Chicken Biryani', quantitySold: 18, revenue: 8100 },
      { name: 'Mint Margarita', quantitySold: 30, revenue: 6000 },
      { name: 'Karak Chai', quantitySold: 45, revenue: 3600 },
      { name: 'Chocolate Brownie', quantitySold: 15, revenue: 2700 },
    ],
    ordersByStatus: {
      completed: 71,
      cancelled: 4
    }
  }
};
