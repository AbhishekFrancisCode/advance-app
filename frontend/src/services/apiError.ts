// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleApiError = (error: any) => {
  if (error.response) {
    return error.response.data?.message || "Something went wrong";
  }

  if (error.request) {
    return "No response from server";
  }

  return "Unexpected error";
};