import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import AdminLayout from "@/components/AdminLayout";
import AppLayout from "@/components/AppLayout";
import PublicLayout from "@/components/PublicLayout";
import PageNotFound from "@/components/PageNotFound";
import StepIns from "@/pages/StepIns";
import Students from "@/pages/Students";
import StepIn from "@/pages/StepIn";
import { SidebarProvider } from "@/app/context/sidebarContext";
import AllStepIns from "@/pages/AllStepIns";
import Auth from "@/pages/Auth";
import AllStudents from "@/features/students/components/AllStudents";
import Student from "@/features/students/components/Student";
import Support from "./pages/Support";
import Reports from "./pages/Reports";
import LoginForm from "./features/authentication/components/LoginForm";
import ForgotPasswordForm from "./features/authentication/components/ForgotPasswordForm";
import ResetPasswordForm from "./features/authentication/components/ResetPasswordForm";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <SidebarProvider>
        <BrowserRouter basename="/axola">
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/announcements" element={<Home />} />

              <Route path="/step-ins" element={<StepIns />}>
                <Route index element={<AllStepIns />} />
                <Route path="view" element={<StepIn />} />
              </Route>

              <Route path="/support" element={<Support />} />

              <Route path="/students" element={<Students />}>
                <Route index element={<AllStudents />} />
                <Route path=":id" element={<Student />} />
              </Route>

              <Route path="/reports" element={<Reports />} />

              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="manage" element={<Dashboard />} />
                <Route path="manage/user/:userId" element={<Dashboard />} />
                <Route path="settings" element={<Dashboard />} />
              </Route>
            </Route>

            <Route element={<PublicLayout />}>
              <Route element={<Auth />}>
                <Route path="/login" element={<LoginForm />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordForm />}
                />
                <Route path="/reset-password" element={<ResetPasswordForm />} />
              </Route>
            </Route>

            {/* Catch-All 404 Route */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </>
  );
}

export default App;
