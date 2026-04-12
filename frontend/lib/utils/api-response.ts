import { NextResponse } from 'next/server';

export type ApiErrorCode =
  | 'INVALID_INPUT'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INTERNAL_ERROR'
  | 'INVALID_STATE_TRANSITION';

export interface ApiError {
  error: string;
  code?: ApiErrorCode;
}

export function successResponse<T>(data: T, status: number = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function errorResponse(
  message: string,
  code: ApiErrorCode,
  status: number = 400
): NextResponse<ApiError> {
  return NextResponse.json({ error: message, code }, { status });
}

export function notFoundResponse(message: string = 'Resource not found'): NextResponse<ApiError> {
  return errorResponse(message, 'NOT_FOUND', 404);
}

export function badRequestResponse(message: string = 'Invalid input'): NextResponse<ApiError> {
  return errorResponse(message, 'INVALID_INPUT', 400);
}

export function internalErrorResponse(message: string = 'Internal server error'): NextResponse<ApiError> {
  return errorResponse(message, 'INTERNAL_ERROR', 500);
}
