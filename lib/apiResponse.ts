import { NextResponse } from "next/server";

// Response with data
export function ApiResponse<T>(
  success: boolean,
  message: string,
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    { success, message, data },
    { status }
  );
}

// Response without data
export function ApiMessage(
  success: boolean,
  message: string,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    { success, message },
    { status }
  );
}