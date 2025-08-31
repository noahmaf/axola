import * as XLSX from 'xlsx';

export async function exportStepToExcel(
  stepName: string,
  studentResponses: any[]
) {
  if (!studentResponses || studentResponses.length === 0) return;

  try {
    const questionSet = new Set<string>();

    for (var studentResponse in studentResponses) {
      Object.entries(studentResponses[studentResponse].response).forEach(([question, _]) => {
        questionSet.add(question);
      });
    }

    const questions = Array.from(questionSet);

    // Create worksheet data
    const wsData = [
      [
        "Full Names",
        "Student Number",
        "Email",
        "Submission Date",
        ...questions,
      ],
    ];

    // Add rows
    studentResponses.forEach((student) => {
      const row = [
        student.fullName,
        student.studentNumber,
        student.email,
        student.submissionDate,
        ...questions.map((q) => {
          const response = student.response[q];
          return response ? `${response}` : "";
        }),
      ];
      wsData.push(row);
    });

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Responses");

    // Generate Excel file and download
    XLSX.writeFile(wb, `${stepName} - Axola Submission Report.xlsx`);
  } catch (error) {
    console.error("Excel export failed:", error);
  }
}

export async function exportStudentsToExcel(title: string, students: any[]) {
  if (!students || students.length === 0) return;

  try {
    // Create worksheet data
    const wsData = [
      [
        "Full Names",
        "Email",
        "Student Number",
        "CellPhone Number",
        "Level Of Study",
        "Study Programme",
      ],
    ];

    // Add rows
    students.forEach((student) => {
      const row = [
        student.fullName,
        student.email,
        student.studentNumber,
        student.cellPhoneNumber,
        student.levelOfStudy,
        student.studyProgramme,
      ];
      wsData.push(row);
    });

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    // Generate Excel file and download
    XLSX.writeFile(wb, `${title} - Axola Report.xlsx`);
  } catch (error) {
    console.error("Excel export failed:", error);
  }
}