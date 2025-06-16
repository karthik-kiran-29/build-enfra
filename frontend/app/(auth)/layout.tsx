
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    console.log("auth visited");
  return (
    <html lang="en">
        <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Authentication</title>
        </head>
        <body >
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}