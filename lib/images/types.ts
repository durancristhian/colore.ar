/** Request body for creating an image */
export interface CreateImageRequest {
  description: string;
}

/** Success response for POST /api/images */
export interface CreateImageResponse {
  id: string;
  url: string;
}

/** Item returned by GET /api/images (list) and GET /api/images/:id (single) */
export interface ImageListItem {
  id: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

/** Error response shape */
export interface ErrorResponse {
  error: string;
}
