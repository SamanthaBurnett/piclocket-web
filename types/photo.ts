export interface CreateUploadRequest {
    filename: string;
    contentType: string;
    fileSizeBytes: number;
}

export interface CreateUploadResponse {
    photoId: string;
    uploadUrl: string;
}
