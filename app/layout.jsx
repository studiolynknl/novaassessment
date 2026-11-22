import './globals.css';

export const metadata = {
  title: 'NOVA — Centrum voor Herstel',
  description: 'Fysiotherapie en revalidatie voor wat jij weer wilt kunnen. NOVA, Centrum voor Herstel in Arnhem, Zutphen en Apeldoorn.',
  icons: { icon: '/assets/boog.svg' }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#24352d'
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <noscript><style>{'.loader,.loader-logo{display:none}'}</style></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
