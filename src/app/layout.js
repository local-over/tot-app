import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "TOT — The Only Topic",
  description: "One topic per day. Picked for you. Read it. Rate it. Come back tomorrow.",
  keywords: "daily reading, learning, topics, knowledge, reading habit",
  openGraph: {
    title: "TOT — The Only Topic",
    description: "One topic per day. Picked for you.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
