import BottomNav from '../../components/customer/BottomNav';
import TopHeader from '../../components/customer/TopHeader';

export default function CustomerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopHeader />
      <main className="flex-1 w-full max-w-5xl mx-auto pb-20 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
