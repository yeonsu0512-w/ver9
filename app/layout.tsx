import type { Metadata } from "next";
import "./globals.css";
import { Topbar } from "@/components/layout/topbar";
import { Sidebar } from "@/components/layout/sidebar";
import { ReactQueryProvider } from "@/lib/query-client";

export const metadata: Metadata = {
  title: "SINSUNGCNS | Workforce Experience",
  description: "SINSUNG CNS Workforce Experience Portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ReactQueryProvider>
          <Topbar />
          <Sidebar />
          <div className="main-content">
            {children}
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
