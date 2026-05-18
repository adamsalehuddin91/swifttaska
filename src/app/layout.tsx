import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import AntdPatch from "@/components/providers/AntdPatch";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App as AntdApp } from 'antd';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  title: "SwiftTaska - Nursery & Kindergarten Management",
  description: "Complete management system for nursery and kindergarten",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SwiftTaska",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

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
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                // Primary Colors - Professional Indigo/Purple
                colorPrimary: '#6366f1',
                colorSuccess: '#10b981',
                colorWarning: '#f59e0b',
                colorError: '#ef4444',
                colorInfo: '#3b82f6',

                // Border & Radius
                borderRadius: 12,
                borderRadiusLG: 16,
                borderRadiusSM: 8,

                // Typography
                fontFamily: geistSans.style.fontFamily,
                fontSize: 14,
                fontSizeHeading1: 38,
                fontSizeHeading2: 30,
                fontSizeHeading3: 24,
                fontSizeHeading4: 20,
                fontSizeHeading5: 16,

                // Spacing
                padding: 16,
                paddingLG: 24,
                paddingSM: 12,

                // Colors
                colorBgContainer: '#ffffff',
                colorBgElevated: '#ffffff',
                colorBgLayout: '#f5f7fa',

                // Shadows
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
                boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
              },
              components: {
                Layout: {
                  siderBg: '#0f172a', // Deep slate for premium look
                  headerBg: '#ffffff',
                  headerHeight: 64,
                  headerPadding: '0 24px',
                },
                Menu: {
                  darkItemBg: '#0f172a',
                  darkItemSelectedBg: 'var(--primary-gradient)',
                  darkItemHoverBg: '#1e293b',
                  darkSubMenuItemBg: '#0f172a',
                  itemMarginInline: 8,
                  itemBorderRadius: 8,
                },
                Card: {
                  borderRadiusLG: 16,
                  paddingLG: 24,
                  boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
                },
                Button: {
                  borderRadius: 8,
                  controlHeight: 40,
                  fontSize: 14,
                  fontWeight: 500,
                },
                Input: {
                  borderRadius: 8,
                  controlHeight: 40,
                },
                Table: {
                  borderRadiusLG: 12,
                  headerBg: '#f8fafc',
                  headerSortActiveBg: '#f1f5f9',
                  rowHoverBg: '#f8fafc',
                },
                Statistic: {
                  titleFontSize: 14,
                  contentFontSize: 28,
                },
              },
            }}
          >
            <AntdPatch>
              <AntdApp>
                <ToastProvider>
                  <AuthProvider>{children}</AuthProvider>
                </ToastProvider>
              </AntdApp>
            </AntdPatch>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
