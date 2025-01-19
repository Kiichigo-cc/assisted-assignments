import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chatbot from "@/components/Chatbot";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar";

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider
        style={{
          "--sidebar-width": "10rem",
          "--sidebar-width-mobile": "10rem",
        }}
      >
        <AppSidebar />
        <div className="w-full p-8">
          <Routes>
            <Route path="/" element={<div>Dashboard</div>} />
            <Route path="/courses" element={<div>Courses</div>} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/settings" element={<div>Settings</div>} />
          </Routes>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
