"use client";

import { useAppStore } from "@/store/useAppStore";
import { ROLE_LABELS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu, User, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "./MobileNav";

export function Header() {
  const session = useAppStore((s) => s.session);
  const logout = useAppStore((s) => s.logout);
  const router = useRouter();

  if (!session) return null;

  const initials = session.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur px-4 lg:px-6">
      <div className="flex items-center gap-3 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-slate-900 border-slate-700">
            <MobileNav />
          </SheetContent>
        </Sheet>
        <span className="font-semibold text-sm">ICAI Carbon Calculator</span>
      </div>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-teal-500" />
        </Button>
        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-sm font-medium">{session.name}</span>
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px] bg-teal-50 text-teal-700">{ROLE_LABELS[session.role]}</Badge>
            <span className="text-xs text-muted-foreground truncate max-w-[150px]">{session.entityName}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-teal-100 text-teal-700 text-xs">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{session.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{session.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
