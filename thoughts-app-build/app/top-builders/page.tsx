'use client'

export default function TopBuildersPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-3 max-w-md">
        <div className="w-16 h-16 mx-auto bg-card border border-border rounded-xl flex items-center justify-center">
          <span className="text-2xl">⭐</span>
        </div>
        <h1 className="text-2xl font-bold">Top Builders</h1>
        <p className="text-sm text-muted-foreground">
          Meet the most active and influential builders in our community. Explore their projects and contributions.
        </p>
      </div>
    </div>
  )
}
