import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/api/supabaseClient";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import CircularLoadingSpinner from "@/components/CircularLoadingSpinner";
import { CloudUpload } from "lucide-react";
import { useAuth } from "@/app/context/authContext";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface StudentCSV {
  name: string;
  surname: string;
  student_number: string;
  profile_picture?: string;
  level_of_study: string;
  university: string;
  email: string;
  cellphone_number?: string;
  whatsapp_number?: string;
  study_programme: string;
}

const REQUIRED_FIELDS: (keyof StudentCSV)[] = [
  "name",
  "surname",
  "student_number",
  "level_of_study",
  "university",
  "email",
  "study_programme",
];

export default function UploadStudentDialog({ open, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [validStudents, setValidStudents] = useState<StudentCSV[]>([]);
  const [invalidStudents, setInvalidStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user: adminUser } = useAuth();

  useEffect(() => {
    if (!open) {
      setValidStudents([]);
      setInvalidStudents([]);
      setLoading(false);
    }
  }, [open]);

  const handleClickUpload = () => {
    inputRef.current?.click();
  };

  const handleFile = async (file: File) => {
    setLoading(true);
    const text = await file.text();
    const [headerLine, ...lines] = text.trim().split(/\r?\n/);
    const headers = headerLine.split(",").map((h) => h.trim());

    const records = lines.map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const record: any = {};
      headers.forEach((key, index) => {
        record[key] = values[index] ?? "";
      });
      return record;
    });

    const emails = records.map((r) => r.email);
    const { data: allUsers, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("Error fetching users:", error.message);
      return;
    }

    const existing = allUsers.users.filter((user) =>
      emails.includes(user.email)
    );

    const existingEmails = new Set(existing?.map((e) => e.email));
    const valid: StudentCSV[] = [];
    const invalid: any[] = [];

    for (const record of records) {
      const isValid =
        REQUIRED_FIELDS.every(
          (key) => typeof record[key] === "string" && record[key].trim() !== ""
        ) && !existingEmails.has(record.email);

      isValid ? valid.push(record as StudentCSV) : invalid.push(record);
    }

    setValidStudents(valid);
    setInvalidStudents(invalid);
    setLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".csv")) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".csv")) handleFile(file);
  };

  const handleImport = async () => {
    setIsUploading(true);
    for (const student of validStudents) {
      try {
        const { data, error } = await supabase.auth.admin.inviteUserByEmail(
          student.email,
          {
            data: {
              studentName: student.name,
              organisationName: adminUser?.currentProgram?.name,
            },
          }
        );

        if (error) {
          toast.error(`Failed to invite ${student.email}: ${error.message}`);
          continue;
        }

        const userId = data?.user?.id;

        if (!userId) {
          toast.error(`No user ID returned for ${student.email}`);
          continue;
        }

        // Insert into `students` table
        const { error: insertError } = await supabase.from("students").insert({
          id: userId,
          name: student.name,
          surname: student.surname,
          student_number: student.student_number,
          profile_picture: student.profile_picture || null,
          level_of_study: student.level_of_study,
          university: student.university,
          email: student.email,
          cellphone_number: student.cellphone_number || null,
          whatsapp_number: student.whatsapp_number || null,
          study_programme: student.study_programme,
          program: adminUser?.currentProgram?.id,
        });

        if (insertError) {
          toast.error(`Failed to add student ${student.email}`);
        } else {
          toast.success(
            `Successfully invited and added student ${student.email}`
          );
        }
      } catch (e) {
        toast.error(`Failed to add student ${student.email}`);
      }
    }
    setIsUploading(false);

    onClose();
  };

  const clearAll = () => {
    setValidStudents([]);
    setInvalidStudents([]);
    inputRef.current!.value = "";
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-fit  w-fit max-h-[100%] overflow-auto ">
        <AlertDialogHeader>
          <div className="flex justify-between items-center gap-24">
            <div className="flex flex-col">
              <AlertDialogTitle className="text-lg flex items-center">
                Add Students
              </AlertDialogTitle>

              <AlertDialogDescription className="text-sm ">
                Upload a CSV file to bulk import students to your organisation.
              </AlertDialogDescription>
            </div>

            {(validStudents.length > 0 || invalidStudents.length > 0) && (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleClickUpload}>
                  Upload Another CSV
                </Button>
                <Button variant="ghost" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </AlertDialogHeader>

        {!loading &&
          validStudents.length === 0 &&
          invalidStudents.length === 0 && (
            <div
              onClick={handleClickUpload}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex  flex-col justify-center items-center border-2 border-dashed border-secondary rounded-md p-6 cursor-pointer bg-secondary-5 hover:bg-secondary-10 transition"
            >
              <CloudUpload className="text-secondary h-16 w-16" />
              <p className="mt-2 text-secondary font-medium text-sm">
                Drag and drop CSV file here or click here to upload
              </p>
            </div>
          )}

        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
        />

        {loading && (
          <div className="flex flex-col w-full justify-center items-center">
            <CircularLoadingSpinner
              className="flex items-center justify-center h-12 w-12"
              color="#009CA6"
              size={38}
            />
            <p className="text-sm text-muted-foreground mt-4">
              Processing file...
            </p>
          </div>
        )}

        {validStudents.length > 0 && (
          <div className="space-y-2 mt-6">
            <h3 className=" font-semibold text-green-700">
              Valid Students ({validStudents.length})
            </h3>
            <div className="border rounded-md overflow-auto max-h-72">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="sticky top-0 bg-green-50 border-b text-green-800 font-semibold z-10">
                  <tr>
                    <th className="px-3 py-4 whitespace-nowrap">Name</th>
                    <th className="px-3 py-4 whitespace-nowrap">Surname</th>
                    <th className="px-3 py-4 whitespace-nowrap">Email</th>
                    <th className="px-3 py-4 whitespace-nowrap">University</th>
                    <th className="px-3 py-4 whitespace-nowrap">
                      Level of Study
                    </th>
                    <th className="px-3 py-4 whitespace-nowrap">
                      Study Programme
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {validStudents.map((s, i) => (
                    <tr
                      key={i}
                      className="border-b even:bg-green-50/40 text-green-900"
                    >
                      <td className="px-3 py-3 whitespace-nowrap">{s.name}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {s.surname}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">{s.email}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {s.university}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {s.level_of_study}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {s.study_programme}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {invalidStudents.length > 0 && (
          <div className="space-y-2 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-red-700">
                Invalid Students ({invalidStudents.length})
              </h3>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setInvalidStudents([]);
                  inputRef.current!.value = "";
                }}
              >
                Discard Invalid Students
              </Button>
            </div>
            <div className="border rounded-md overflow-auto max-h-72">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="sticky top-0 bg-red-50 border-b text-red-800 font-semibold z-10">
                  <tr>
                    <th className="px-3 py-4 whitespace-nowrap">Email</th>
                    <th className="px-3 py-4 whitespace-nowrap">
                      Missing Fields
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invalidStudents.map((s, i) => {
                    const missing = REQUIRED_FIELDS.filter(
                      (f) => !s[f] || s[f].trim() === ""
                    ).join(", ");
                    return (
                      <tr
                        key={i}
                        className="border-b even:bg-red-50/40 text-red-900"
                      >
                        <td className="p-3 whitespace-nowrap">
                          {s.email || "Unknown"}
                        </td>
                        <td className="p-3 whitespace-nowrap text-muted-foreground">
                          {missing || "Already exists"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <AlertDialogFooter className="flex justify-end gap-2 pt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isUploading || validStudents.length === 0}
            onClick={handleImport}
          >
            {isUploading && (
              <CircularLoadingSpinner
                className="flex items-center justify-center h-12 w-12"
                color="white"
                size={38}
              />
            )}
            {!isUploading && <p>Import</p>}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
