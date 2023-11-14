import { ReactElement } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFileContext } from "@/context";
import { FileStatus, File } from "@/lib/file";
import { processFile } from "@/lib/utils";
import { FileActionType } from "@/constants";

function formatStatus(status: FileStatus) {
  switch (status) {
    case FileStatus.WAITING_FOR_PROCESS:
      return "Waiting for Process";
    case FileStatus.PROCESSING:
      return "Processing";
    case FileStatus.PROCESSED:
      return "Processed";
    case FileStatus.ERROR_ON_PROCESS:
      return "Failed to Process";
  }
}

function FileList(): ReactElement {
  const {
    state: { fileList },
    dispatch,
  } = useFileContext();
  // Remember to keep the fileList updated after upload a new file

  function startProcessing(file: File) {
    processFile(file).then(() => {
      dispatch({
        type: FileActionType.SET_FILE_LIST,
        payload: {
          fileList: fileList.map((_file) => {
            if (_file.id === file.id) {
              return { ..._file, status: FileStatus.PROCESSING };
            }
            return _file;
          }),
        },
      });
    });
  }

  return (
    <>
      <h1 className="text-2xl font-bold pt-5 text-green-800">File List</h1>

      <Table>
        <TableCaption>A list of your {`something`}.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(fileList || []).map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">{file.id}</TableCell>
              <TableCell>{file.fileName}</TableCell>
              <TableCell>{formatStatus(file.status)}</TableCell>
              <TableCell className="text-right">
                {file.status === FileStatus.WAITING_FOR_PROCESS && (
                  <button onClick={() => startProcessing(file)}>
                    Process File
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export { FileList };
