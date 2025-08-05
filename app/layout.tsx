import './globals.css';

export const metadata = {
  title: 'FHA Quote Chatbot',
  description: 'Chat with our FHA quote calculator',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#121212', color: '#fff', minHeight: '100vh', padding: '1rem' }}>
        <main style={{ maxWidth: '600px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
