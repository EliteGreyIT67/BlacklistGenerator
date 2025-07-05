import { Link, useLocation } from "wouter";
import { Home, AlertTriangle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    {
      href: "/",
      label: "Blacklist Generator",
      icon: <Home className="w-4 h-4" />,
    },
    {
      href: "/incidents",
      label: "Enhanced Documentation",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-lg text-gray-900">
                  Animal Rescue Alert System
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={location === item.href ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}