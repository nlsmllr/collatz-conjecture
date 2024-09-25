import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "Collatz Conjecture",
  description: "Nils Müller",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
