import { Rajdhani } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import TransitionProvider from "@/components/transitionProvider";
const rajdhani = Rajdhani({ weight: ['500', '600'], subsets: ["latin"] });

export const metadata = {
  title: "Inventora",
  description: "Developed By Rounak",
};

export default function RootLayout({ children }) {
  return (
    <AppRouterCacheProvider>
      <ClerkProvider>
        <html lang="en">
          <body className={rajdhani.className}>
            <TransitionProvider>{children}</TransitionProvider>
          </body>
        </html>
      </ClerkProvider>
    </AppRouterCacheProvider>
  );
}
