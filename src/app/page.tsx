import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#050505] to-black text-white">
      <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 blur-[120px] pointer-events-none" />
      <Dashboard />
    </main>
  );
}
