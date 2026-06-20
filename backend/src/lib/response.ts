import type { Response } from "express";

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  pagination?: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: string;
  details?: { field: string; message: string }[];
}

export function success<T = unknown>(
  res: Response,
  data: T,
  pagination?: PaginationMeta,
  statusCode = 200
): void {
  const body: ApiSuccess<T> = { success: true, data };
  if (pagination) body.pagination = pagination;
  res.status(statusCode).json(body);
}

export function fail(
  res: Response,
  error: string,
  statusCode = 500,
  details?: { field: string; message: string }[]
): void {
  const body: ApiError = { success: false, error };
  if (details) body.details = details;
  res.status(statusCode).json(body);
}
