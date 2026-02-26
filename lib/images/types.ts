// types.ts
//
// Request/response and list types for the images API.
//
/** POST /api/images body. */
export interface CreateImageRequest {
  description: string;
}

/** POST /api/images success. */
export interface CreateImageResponse {
  id: string;
  url: string;
}

/** GET /api/images list and GET /api/images/:id single item. */
export interface ImageListItem {
  id: string;
  description: string | null;
  imageUrl: string;
  sourceImageUrl?: string | null;
  createdAt: string;
}

/** Error payload shape. */
export interface ErrorResponse {
  error: string;
}
