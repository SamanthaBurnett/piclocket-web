export interface CreateUploadRequest {
    filename: string;
    contentType: string;
    fileSizeBytes: number;
}

export interface CreateUploadResponse {
    photoId: string;
    uploadUrl: string;
}

export interface PhotoResponse {
    photoId: string;
    status: string;
    downloadUrl: string;
}
