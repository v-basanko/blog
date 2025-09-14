import { auth } from '@/auth';
import NavBar from '@/components/layout/nav-bar';
import { EdgeStoreProvider } from '@/lib/edgestore';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const popins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Next Blog',
  description: 'Next.js WebApp Multi User Blog',
  icons: { icon: '/logo.svg' },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const themeInitScript = `
    try {
      const stored = localStorage.getItem('theme'); // 'light' | 'dark' | null
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = stored ? stored === 'dark' : prefersDark;
      document.documentElement.classList.toggle('dark', isDark);
    } catch {}
  `;

  return (
    <EdgeStoreProvider>
      <SessionProvider session={session}>
        <html lang="en" suppressHydrationWarning>
          <head>
            <meta name="color-scheme" content="light dark" />
            <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
          </head>
          <body
            className={cn(
              'antialiased flex flex-col min-h-screen text-black bg-white dark:bg-black dark:text-white',
              popins.variable,
            )}
          >
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  background: 'rgb(51 65 85)',
                  color: '#fff',
                },
              }}
            />
            <ThemeProvider
              attribute="data-theme"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NavBar />
              <main className="flex-grow">{children}</main>
              <footer>...</footer>
            </ThemeProvider>
          </body>
        </html>
      </SessionProvider>
    </EdgeStoreProvider>
  );
}
