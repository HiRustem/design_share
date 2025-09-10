import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClientProviderWrapper } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Design Share - Безопасный обмен дизайн-проектами",
  description: "Платформа для дизайнеров для безопасного обмена проектами с заказчиками. Добавляйте водяные знаки, создавайте временные ссылки для просмотра.",
  keywords: "дизайн, проекты, водяные знаки, PDF, безопасность, заказчики",
  authors: [{ name: "Design Share Team" }],
  creator: "Design Share",
  publisher: "Design Share",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://designshare.com",
    siteName: "Design Share",
    title: "Design Share - Безопасный обмен дизайн-проектами",
    description: "Платформа для дизайнеров для безопасного обмена проектами с заказчиками",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Share - Безопасный обмен дизайн-проектами",
    description: "Платформа для дизайнеров для безопасного обмена проектами с заказчиками",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} antialiased`}>
        <QueryClientProviderWrapper>
          {children}
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
