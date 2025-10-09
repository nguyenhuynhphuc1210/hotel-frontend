import { Outlet } from "react-router-dom";
import ClientHeader from "./ClientHeader";
import ClientFooter from "./ClientFooter";

export default function ClientLayout() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800">
      <ClientHeader />
      <main className="flex-1 container mx-auto p-8 text-lg leading-relaxed">
        <Outlet />
      </main>
      <ClientFooter />
    </div>
  );
}
