/** Request body for creating a preview image */
export interface CreatePreviewRequest {
  description: string;
}

/** Success response for POST /api/images */
export interface CreatePreviewResponse {
  id: string;
  url: string;
}

/** Error response shape */
export interface ErrorResponse {
  error: string;
}
