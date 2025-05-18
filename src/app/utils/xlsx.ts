export async function exportStepToCSV(
  stepName: string,
  studentResponses: any[]
) {
  if (!studentResponses || studentResponses.length === 0) return;
  try {
    const questionSet = new Set<string>();

    Object.entries(studentResponses[0].response).forEach(
      ([question, _], __) => {
        questionSet.add(question);
      }
    );

    const questions = Array.from(questionSet);

    // Create CSV header
    let csvContent = [
      [
        "Full Names",
        "Student Number",
        "Email",
        "Submission Date",
        ...questions,
      ].join(","),
    ];

    // Create CSV rows
    studentResponses.forEach((student) => {
      const row = [
        student.fullName,
        student.studentNumber,
        student.email,
        student.submissionDate,
        ...questions.map((q) => {
          const response = student.response[q];
          return response ? `"${response}"` : "";
        }),
      ];
      csvContent.push(row.join(","));
    });

    // Convert array to CSV string
    const csvString = csvContent.join("\n");

    // Create and download the file
    const blob = new Blob([csvString], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${stepName} - Axola Submission Report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {}
}

export async function exportStudentsToCSV(title: string, students: any[]) {
  if (!students || students.length === 0) return;
  try {
    // Create CSV header
    let csvContent = [
      [
        "Full Names",
        "Email",
        "Student Number",
        "CellPhone Number",
        "Level Of Study",
        "Study Programme",
      ].join(","),
    ];

    // Create CSV rows
    students.forEach((student) => {
      const row = [
        student.fullName,
        student.email,
        student.studentNumber,
        student.cellPhoneNumber,
        student.levelOfStudy,
        student.studyProgramme,
      ];
      csvContent.push(row.join(","));
    });

    // Convert array to CSV string
    const csvString = csvContent.join("\n");

    // Create and download the file
    const blob = new Blob([csvString], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title} - Axola Report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {}
}
