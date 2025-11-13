import "./globals.css";

export const metadata = {
  title: "F1 Companion",
  description: "Your ultimate F1 fan companion app",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-sans  min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}