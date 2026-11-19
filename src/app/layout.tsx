import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opella AmplifAI | Real-Time Use Case Lifecycle & Governance Playbook",
  description:
    "Interactive operating model and real-time use case lifecycle simulator for Opella AmplifAI and Butterfly governance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-opella-sand text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
