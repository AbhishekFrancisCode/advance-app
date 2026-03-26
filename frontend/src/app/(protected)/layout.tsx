
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/shared/AuthGuard";


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 bg-gray-50 dark:bg-black">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}