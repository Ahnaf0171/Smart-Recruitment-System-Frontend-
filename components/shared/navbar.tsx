"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/assets/logos/logo.png";
import Image from "next/image";
import { clearCookie, getCookie } from "@/lib/utils";
import { LayoutDashboard, LogInIcon, LogOut, User2Icon } from "lucide-react";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

function Navbar() {
  const router = useRouter();
  const handleLogout = () => {
    clearCookie("access_token");
    clearCookie("user_role");
    clearCookie("user_name");
    router.push("/login");
  };
  const token = getCookie("access_token");
  const user_role = getCookie("user_role");
  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-sidebar-border glass-effect">
      <div className="container mx-auto max-w-6xl py-4 px-4 flex items-center justify-between animate-fade-in">
        <Link href="/" className="inline-flex items-center">
          <Image
            src={logo}
            alt="logo"
            width={1000}
            height={1000}
            className="object-cover w-auto m-auto h-10 md:h-12 animate-fade-in"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-0.5 font-body">
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" size="lg" asChild>
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          {token && user_role ? (
            <div className="flex gap-2 mr-2">
              <Button asChild size="sm">
                <Link href={`/${user_role}/dashboard`}>
                  <LayoutDashboard />{" "}
                  <span className="hidden md:flex">Go to Dashboard</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut /> <span className="hidden md:flex">Logout</span>{" "}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 mr-2">
              <Button variant="outline" asChild size="sm">
                <Link href="/login">
                  <LogInIcon /> <span className="hidden md:flex">Sign In</span>
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">
                  <User2Icon />{" "}
                  <span className="hidden md:flex">Get Started</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
