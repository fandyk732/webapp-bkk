export default function Loading() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
      <div className="h-8 w-64 bg-muted rounded-lg mb-2" />
      <div className="h-4 w-96 bg-muted rounded-lg mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-card border border-border rounded-2xl p-5" />
        ))}
      </div>
    </div>
  );
}