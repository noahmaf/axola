import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/index.css";

import App from "@/App.tsx";
import { AuthProvider } from "@/app/context/authContext.tsx";
import { StepsProvider } from "./features/step-ins/context/stepsContext";
import { AnnouncementsProvider } from "./features/announcements/context/announcmentsContext";
import { SupportChatsProvider } from "./features/support/context/supportContext";
import { StudentsProvider } from "./features/students/context/studentsContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AnnouncementsProvider>
        <StepsProvider>
          <SupportChatsProvider>
            <StudentsProvider>
              <App />
            </StudentsProvider>
          </SupportChatsProvider>
        </StepsProvider>
      </AnnouncementsProvider>
    </AuthProvider>
  </StrictMode>
);
