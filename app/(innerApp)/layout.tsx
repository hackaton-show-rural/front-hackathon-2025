export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <main className="">
      <div className="">
        <div className="">
          {children}
        </div>
      </div>
    </main>
  )
}
