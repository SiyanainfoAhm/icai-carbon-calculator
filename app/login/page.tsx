"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginPage() {
  const router = useRouter();
  const session = useAppStore((s) => s.session);
  const hydrated = useAppStore((s) => s.hydrated);

  useEffect(() => {
    if (hydrated && session) {
      router.replace("/dashboard");
    }
  }, [hydrated, session, router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (session) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-teal-700">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <LoginForm />
      </div>
    </div>
  );
}
