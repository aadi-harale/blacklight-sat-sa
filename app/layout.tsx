import type { Metadata } from 'next';
import './globals.css';
import './readability.css';
import './accessibility.css';

export const metadata: Metadata = {
  title: 'BLACKLIGHT — Proof Before Prediction',
  description:
    'Deterministic evidence reasoning for supervisory SOC assessment. Built for SIH26157.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
