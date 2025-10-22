import './globals.css'

export const metadata = {
  title: "Kosta's Transformation Tracker",
  description: 'Track your fitness journey and win every day',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
