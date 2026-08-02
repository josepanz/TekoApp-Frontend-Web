import type { Metadata } from 'next';
import { Geist_Mono, Poppins } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryProvider } from '@/core/providers/query-provider';
import { ThemeProvider } from '@/core/providers/theme-provider';
import './globals.css';

// Tipografía única de marca (manual de marca) — Light/Regular/SemiBold/Bold, usada tanto para
// texto de cuerpo (font-sans) como para headings (font-heading), ver design-system/tokens/tokens.json.
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TekoApp',
  description:
    'Portal de TekoApp: solicitar y ofrecer servicios profesionales, y panel de administración.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Locale resuelto por request (cookie de preferencia / Accept-Language) — ver src/i18n/request.ts.
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* NextIntlClientProvider hereda locale + messages del request config (getRequestConfig)
            automáticamente al renderizarse dentro de un Server Component — no hace falta pasarlos. */}
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
