import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/css/globals.css";
import Navbar from "@/components/common/Navbar"
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
import { Button, ConfigProvider, Space, Input, ColorPicker, Divider } from 'antd';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: primary,
          },
        }}
      >
        <Toaster/>
        <Navbar/>
        {children}
        </ConfigProvider>
        </body>
    </html>
  );
}
