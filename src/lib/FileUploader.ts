type UploadProgressListener = (progress: number) => void;
type ResponseStatus = number;

export class FileUploader {
  private request: XMLHttpRequest;

  constructor(
    private presignedUrl: string,
    private uploadProgressListener: UploadProgressListener
  ) {
    this.request = new XMLHttpRequest();
  }

  upload(file: File): Promise<ResponseStatus> {
    this.request.open("PUT", this.presignedUrl);
    this.request.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream"
    );

    this.request.upload.addEventListener("progress", (e) => {
      this.uploadProgressListener((e.loaded / e.total) * 100);
    });

    const formData = new FormData();
    formData.append("file", file);

    this.request.send(file);

    return new Promise((res) => {
      this.request.addEventListener("load", (e) => {
        res(this.request.status);
      });
    });
  }
}
