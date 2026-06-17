'use client'

export default function MessagesPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-3 max-w-md">
        <div className="w-16 h-16 mx-auto bg-card border border-border rounded-xl flex items-center justify-center">
          <span className="text-2xl">✉</span>
        </div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Connect with other builders and collaborate on ideas. Direct messaging coming soon.
        </p>
      </div>
    </div>
  )
}
