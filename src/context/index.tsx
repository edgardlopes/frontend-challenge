import { createContext, useContext, useEffect, useReducer } from "react";

import { FileActionType } from "@/constants";
import {
  FileAction,
  FileContextState,
  FileDispatch,
  FileProviderProps,
} from "@/types";
import { getFiles } from "@/lib/utils";

export const FileContextInitialValues: Partial<FileContextState> = {
  file: {} as File,
  isLoading: false,
  uploadProgress: 0,
};

const FileContext = createContext<{
  state: FileContextState;
  dispatch: FileDispatch;
}>({
  state: FileContextInitialValues as FileContextState,
  dispatch: () => {
    //
  },
});

const FileReducer = (
  state: FileContextState,
  action: FileAction
): FileContextState => {
  switch (action.type) {
    case FileActionType.SET_UPLOAD_FILE: {
      return { ...state, file: action.payload?.file || null };
    }
    case FileActionType.SET_FINISH_UPLOAD: {
      return {
        ...state,
        file: null,
        isLoading: false,
        uploadProgress: 0,
      };
    }
    case FileActionType.SET_IS_LOADING: {
      return { ...state, isLoading: !!action.payload?.isLoading };
    }
    case FileActionType.SET_UPLOAD_PROGRESS: {
      return {
        ...state,
        uploadProgress: Math.trunc(action.payload?.uploadProgress || 0),
      };
    }
    case FileActionType.SET_FILE_LIST: {
      return { ...state, fileList: action.payload?.fileList || [] };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const FileProvider = ({ children }: FileProviderProps) => {
  const [state, dispatch] = useReducer(
    FileReducer,
    FileContextInitialValues as FileContextState
  );

  useEffect(() => {
    getFiles().then((files) => {
      dispatch({
        type: FileActionType.SET_FILE_LIST,
        payload: {
          fileList: files,
        },
      });
    });
  }, []);

  return (
    <FileContext.Provider value={{ state, dispatch }}>
      {children}
    </FileContext.Provider>
  );
};

const useFileContext = () => {
  const context = useContext(FileContext);

  if (context === undefined)
    throw new Error("useFileContext must be used within a FileProvider");

  return context;
};

export { FileProvider, useFileContext };
