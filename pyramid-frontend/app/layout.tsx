import type { Metadata } from 'next';
import { AuthProvider } from './context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pyramid - Task Management',
  description: 'A modern task management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}