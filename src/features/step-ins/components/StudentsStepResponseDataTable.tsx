import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { v4 as uuidv4 } from "uuid";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

import EmptyResponses from "@/assets/images/empty-step-responses.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AxolaStudentStepResponse } from "@/app/models/AxolaStudent";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function StudentStepResponseDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility: { response: false, id: false },
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const [currentResponse, setCurrentResponse] =
    useState<AxolaStudentStepResponse | null>(null);

  const viewResponseDialogActionClick = (
    response: AxolaStudentStepResponse | null
  ) => {
    setCurrentResponse(response);
  };

  return (
    <AlertDialog>
      <div className="rounded-md border text-black bg-white select-none">
        <Table>
          <TableHeader className="bg-secondary bg-opacity-15 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-[16px] font-semibold text-secondary"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <AlertDialogTrigger key={row.id} asChild>
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      viewResponseDialogActionClick({
                        id: (row.original as any).id,
                        fullName: (row.original as any).fullName,
                        email: (row.original as any).email,
                        studentNumber: (row.original as any).studentNumber,
                        response: (row.original as any).response,
                        submissionDate: (row.original as any).submissionDate,
                      });
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </AlertDialogTrigger>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="flex flex-col  items-center justify-center text-center space-y-12 p-24">
                    <img className="h-32 " src={EmptyResponses} />
                    <p className=" text-lg font-medium  text-neutral-500">
                      No responses have been submitted yet.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialogContent className="text-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="select-none">
            Student Response
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription></AlertDialogDescription>
        <div className="flex flex-col space-y-8 select-none h-[600px]">
          <div className="flex flex-col w-full space-y-3 text-neutral-600 bg-neutral-200 bg-opacity-35 rounded-md p-4  border-orange-500 border-dashed border-2">
            <div className="flex flex-col">
              <p className="text-secondary font-semibold ">Name</p>
              <p>{currentResponse?.fullName}</p>
            </div>

            <div className="flex w-full justify-between">
              <div className="flex flex-col">
                <p className="text-secondary font-semibold ">Student Number</p>
                <p>{currentResponse?.studentNumber}</p>
              </div>

              <div className="flex flex-col">
                <p className="text-secondary font-semibold ">Submission Date</p>
                <p>{currentResponse?.submissionDate}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4  overflow-y-auto  h-[100%]">
            {currentResponse &&
              Object.entries(currentResponse.response).map(
                ([question, answer], __) => {
                  return (
                    <div
                      key={uuidv4()}
                      className="flex flex-col bg-secondary bg-opacity-10 p-3 rounded-md space-y-2"
                    >
                      <p className="text-orange-500 font-semibold text-sm ">
                        {question}
                      </p>
                      <p>{answer as string}</p>
                    </div>
                  );
                }
              )}
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              viewResponseDialogActionClick(null);
            }}
            className="bg-secondary text-white hover:bg-secondary hover:bg-opacity-80 min-w-[100px] flex"
          >
            <p>Done</p>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
