import { FileActionType } from "@/constants";
import { useFileContext } from "@/context";
import { FileUploader } from "@/lib/FileUploader";
import { File } from "@/lib/file";
import { getFiles, getPresignedURL } from "@/lib/utils";
import { ChangeEvent } from "react";

const SingleFileUploader = () => {
  const {
    state: { file, isLoading, uploadProgress },
    dispatch,
  } = useFileContext();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Do not use useState to control this file change. Instead, use the FileContext

    if (e.target.files?.length) {
      dispatch({
        type: FileActionType.SET_UPLOAD_FILE,
        payload: {
          file: e.target.files[0],
        },
      });
    }
  };

  const handleUpload = async () => {
    // Do your upload logic here. Remember to use the FileContext
    if (!file) {
      return;
    }

    dispatch({
      type: FileActionType.SET_IS_LOADING,
      payload: {
        isLoading: true,
      },
    });

    const url = await getPresignedURL(file.name);

    const uploader = new FileUploader(url, (uploadProgress) => {
      dispatch({
        type: FileActionType.SET_UPLOAD_PROGRESS,
        payload: {
          uploadProgress,
        },
      });
    });

    await uploader.upload(file);

    dispatch({ type: FileActionType.SET_FINISH_UPLOAD });

    const files = await getFiles();
    dispatch({
      type: FileActionType.SET_FILE_LIST,
      payload: {
        fileList: files,
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="file" className="sr-only">
          Choose a file
        </label>
        <input
          id="file"
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
          onChange={handleFileChange}
        />
      </div>
      {file && (
        <section>
          <p className="pb-6">File details:</p>
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        </section>
      )}

      {file && (
        <button
          disabled={isLoading}
          className="rounded-lg bg-green-800  text-white border-none font-semibold"
          onClick={handleUpload}
        >
          <div
            className={`rounded-lg ${
              isLoading ? "bg-green-600" : ""
            }  p-0.5 text-center py-2 `}
            style={{ width: `${!isLoading ? 100 : uploadProgress}%` }}
          >
            {isLoading ? `${uploadProgress}%` : "Upload the file"}
          </div>
        </button>
      )}
    </div>
  );
};

export { SingleFileUploader };
