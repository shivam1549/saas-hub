export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, John! 👋</h1>
        <p className="text-slate-500">Here is what is happening with your projects today.</p>
      </div>

      {/* Static placeholder for future stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active Sprints</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Tasks Due Soon</p>
          <p className="text-3xl font-bold text-slate-900 mt-2 text-amber-600">5</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Team Members</p>
          <p className="text-3xl font-bold text-slate-900 mt-2 text-blue-600">24</p>
        </div>
      </div>
    </div>
  );
}