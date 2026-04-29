import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const canteenName = process.env.NEXT_PUBLIC_CANTEEN_NAME || 'theCanteen.online';

export const metadata = {
  title: {
    default: canteenName,
    template: `%s | ${canteenName}`,
  },
  description: "Your campus canteen, ready when you are.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground shrink-0">{children}</body>
    </html>
  );
}
