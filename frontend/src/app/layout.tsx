"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "react-redux";
import { AppSidebar } from "./components/app-sidebar";
import BreadcumbComponent from "./components/breadcumb";
import "./globals.css";
import store from "./store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1">
              <BreadcumbComponent />
              {children}
            </main>
          </SidebarProvider>
        </Provider>
      </body>
    </html>
  );
}
