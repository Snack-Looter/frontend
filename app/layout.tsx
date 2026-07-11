import type { Metadata } from "next";
import { Geist, Geist_Mono, Baloo_2, Poppins } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baloo2 = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KopQuest",
  description: "KopQuest - Gamifikasi koperasi desa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${baloo2.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        {/* Icon font dipakai lewat class "material-symbols-rounded" — variant Rounded
            dipilih sesuai design system (lebih playful dibanding Outlined). */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-body text-body">
        <ToastProvider>
          {/* App frame: kunci SEMUA halaman ke lebar kolom mobile (max-w-app = 430px)
              dan pusatkan. Di desktop, area di luar kolom menampilkan --app-backdrop
              sehingga tampak seperti layar HP; di HP kolom mengisi penuh layar. */}
          <div className="mx-auto w-full max-w-app min-h-screen bg-surface shadow-[0_0_60px_rgba(30,27,58,0.14)]">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
