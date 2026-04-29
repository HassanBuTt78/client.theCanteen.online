'use client';

export default function StatusBadge({ status }) {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-700';

  switch (status) {
    case 'Pending':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-700';
      break;
    case 'Confirmed':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-700';
      break;
    case 'Preparing':
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-700';
      break;
    case 'Ready for Pickup':
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
      break;
    case 'Completed':
      bgColor = 'bg-gray-200';
      textColor = 'text-gray-600';
      break;
    case 'Cancelled':
      bgColor = 'bg-red-100';
      textColor = 'text-red-700';
      break;
    default:
      break;
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
}
