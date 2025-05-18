import { exportStepToCSV } from "@/app/utils/xlsx";
import { StudentStepResponseDataTable } from "@/features/step-ins/components/StudentsStepResponseDataTable";
import { studentStepResponseColumns } from "@/features/step-ins/components/StudentStepResponseColumns";
import { useSteps } from "@/features/step-ins/context/stepsContext";
import CircularLoadingSpinner from "@/components/CircularLoadingSpinner";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/app/context/authContext";
import StudentStepResponseDataTableSkeleton from "@/features/step-ins/components/StudentStepResponseDataTableSkeleton";
import { AxolaStudentStepResponse } from "@/app/models/AxolaStudent";

const StepIn = () => {
  const { currentStepResponses, currentStep, viewStep, stepLoading } =
    useSteps();
  const [isExportLoading, setIsExportLoading] = useState(false);
  const { user } = useAuth();

  const location = useLocation();
  const stepState = location.state;

  useEffect(() => {
    if (!user && !stepState.id) return;

    viewStep(stepState.id);
  }, [user]);

  const exportResponses = async () => {
    if (currentStepResponses && currentStep) {
      setIsExportLoading(true);
      await exportStepToCSV(
        currentStep.title,
        convertCurrentStepResponsesToTableData()
      );
      setIsExportLoading(false);
    }
  };

  const convertCurrentStepResponsesToTableData = () => {
    return currentStepResponses!.map((response) => {
      return {
        id: response.id,
        fullName: `${response.student.name} ${response.student.surname} `,
        email: response.student.email,
        studentNumber: response.student.studentNumber,
        submissionDate: response.submitDate,
        response: response.response,
      };
    }) as AxolaStudentStepResponse[];
  };

  return (
    <div className="flex flex-col w-full bg-white items-center justify-start h-fit min-h-full text-black px-8 py-4">
      <div className=" flex w-full  justify-between  items-center ">
        <p className="text-xl font-semibold text-secondary select-none">
          {stepState.title}
        </p>

        <div className="flex space-x-4 w-[546px]">
          <input
            type="search"
            placeholder="Search..."
            className="w-full input"
          />

          <button className="button " onClick={exportResponses}>
            {isExportLoading}
            <p>Export </p>

            {isExportLoading && (
              <CircularLoadingSpinner
                className="flex items-center justify-center"
                color="white"
              />
            )}

            {!isExportLoading && <Download className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {stepLoading ? (
        <div className="w-full  pt-4">
          <StudentStepResponseDataTableSkeleton />
        </div>
      ) : (
        currentStepResponses && (
          <div className="w-full  pt-4">
            <StudentStepResponseDataTable
              columns={studentStepResponseColumns}
              data={convertCurrentStepResponsesToTableData()}
            />
          </div>
        )
      )}
    </div>
  );
};

export default StepIn;
