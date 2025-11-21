import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#050505] to-[#000000]">
      <div className="absolute top-0 left-0 w-full h-96 bg-[var(--color-primary)] opacity-[0.03] blur-[100px] pointer-events-none" />
      <Dashboard />
    </main>
  );
}
