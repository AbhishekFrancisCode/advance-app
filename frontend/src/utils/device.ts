export const getDeviceInfo = (userAgent: string) => {
  if (userAgent.includes("Mac")) return { name: "Mac", icon: "💻" };
  if (userAgent.includes("Windows")) return { name: "Windows", icon: "🖥️" };
  if (userAgent.includes("iPhone")) return { name: "iPhone", icon: "📱" };
  if (userAgent.includes("Android")) return { name: "Android", icon: "📱" };

  return { name: "Unknown Device", icon: "🧩" };
};