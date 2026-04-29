export default function SalesChart({ data }) {
  // Find max revenue to scale the bars
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1); // fallback to 1 to avoid /0
  
  return (
    <div className="w-full h-[250px] flex items-end justify-between gap-2 pt-10">
      {data.map((item, index) => {
        // Calculate height percentage (min 5% so 0 bars are slightly visible)
        const heightPercent = Math.max((item.revenue / maxRevenue) * 100, 5);
        const isToday = index === 4; // Hardcoded 'Fri' as today for mock data visualization
        
        return (
          <div key={item.day} className="flex flex-col items-center flex-1 group">
            {/* Tooltip on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded mb-2 whitespace-nowrap z-10 pointer-events-none absolute -translate-y-10">
              Rs. {item.revenue.toLocaleString()}
              <br/>
              <span className="text-gray-400 font-normal">{item.orders} orders</span>
            </div>
            
            {/* Bar */}
            <div className="w-full relative flex justify-center h-[180px] items-end">
              <div 
                className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500 ease-out ${
                  isToday ? 'bg-primary' : 'bg-orange-200 hover:bg-orange-300'
                }`}
                style={{ height: `${heightPercent}%` }}
              ></div>
            </div>
            
            {/* Label */}
            <span className={`text-xs mt-3 ${isToday ? 'font-black text-gray-900' : 'font-semibold text-gray-500'}`}>
              {item.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}
