// Logout (cookie-based auth)
export function logout() {
  // Call backend logout to clear cookies
  fetch("/auth/logout", {
    method: "POST",
    credentials: "include",
  }).finally(() => {
    // window.location.href = "/login";
  });
}