import { AxolaStudentStepResponse } from "@/app/models/AxolaStudent";
import { ColumnDef } from "@tanstack/react-table";

export const studentStepResponseColumns: ColumnDef<AxolaStudentStepResponse>[] =
  [
    { accessorKey: "id", header: "Id" },
    { accessorKey: "fullName", header: "Full Name" },
    { accessorKey: "studentNumber", header: "Student Number" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "submissionDate", header: "Submission Date" },
    { accessorKey: "response", header: "Response" },
  ];
