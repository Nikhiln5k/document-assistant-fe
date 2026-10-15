import axios from "axios";

/** Every successful backend response is wrapped in this envelope. */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

interface ApiErrorBody {
  message?: string | string[];
}

/** Turns an API or network error into a message that is safe to show the user. */
export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return fallback;
  }

  if (!error.response) {
    return "We couldn't reach the server. Check your connection and try again.";
  }

  const { message } = error.response.data ?? {};

  // Validation errors arrive as a list; the first one is enough to act on.
  if (Array.isArray(message)) {
    return message[0] ?? fallback;
  }

  return message ?? fallback;
}
