import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/provider/redux-provider";
import QueryProvider from "@/provider/query-provider";
import { InitProvider } from "@/provider/init-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ReduxProvider>
          <QueryProvider>
            <InitProvider>{children}</InitProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
