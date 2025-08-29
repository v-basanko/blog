import type {Metadata} from "next";
import {Poppins} from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import NavBar from "@/components/layout/nav-bar";
import {ThemeProvider} from "next-themes";

const popins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const metadata: Metadata = {
    title: "Multi User Blog",
    description: "Next.js WebApp for Multi User Blog",
    icons: {icon: "/logo.svg"}
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    const themeInitScript = `
    try {
      const stored = localStorage.getItem('theme'); // 'light' | 'dark' | null
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = stored ? stored === 'dark' : prefersDark;
      document.documentElement.classList.toggle('dark', isDark);
    } catch {}
  `;

    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <meta name="color-scheme" content="light dark" />
            <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        </head>
        <body
            className={cn('antialiased flex flex-col min-h-screen px-2 text-black bg-white dark:bg-black dark:text-white', popins.variable)}
        >
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
            <NavBar/>
            <main className="flex-grow">{children}</main>
            <footer>...</footer>
        </ThemeProvider>
        </body>
        </html>
    );
}
