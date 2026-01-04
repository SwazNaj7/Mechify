import { Sidebar } from '@/components/dashboard/sidebar';
import { AuroraBackground } from '@/components/ui/aurora-background';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      {/* Aurora background */}
      <div className="fixed inset-0 -z-20">
        <AuroraBackground className="opacity-40" showRadialGradient={false}>
          <div />
        </AuroraBackground>
      </div>

      {/* Dark overlay */}
      <div className="fixed inset-0 -z-10 bg-background/60" />

      <Sidebar />
      <main className="lg:ml-64 min-h-screen overflow-auto">
        <div className="container max-w-7xl mx-auto p-6 pt-20 lg:p-8 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
