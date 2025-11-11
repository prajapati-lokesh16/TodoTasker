import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })
import "./globals.css";


export const metadata = {
  title: "Todo Homepage",
  description: "It is the homepage from where you can signup or login to the Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
          {children}
      </body>
    </html>
  );
}
