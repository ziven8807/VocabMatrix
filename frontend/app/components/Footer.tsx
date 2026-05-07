// src/app/components/Footer.tsx
"use client";
import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  companyName?: string;
  year?: number;
  links?: FooterLink[];
}

export default function Footer({
  // 將預設名稱修改為 VocabMatrix
  companyName = "VocabMatrix",
  year = 2025,
  links = [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
}: FooterProps) {
  return (
    // 頂部線條已改為紫色系
    <footer className="bg-black/90 border-t border-purple-500/30 backdrop-blur-sm relative z-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center space-x-8">
          {/* 版權聲明 */}
          <div className="text-gray-400 text-sm">
            © {year} {companyName}
          </div>

          {/* 連結 */}
          <div className="flex items-center space-x-6">
            {links.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                // 懸停顏色為紫色
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm font-medium"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
