export async function logError(message: string, info?: unknown) {
  try {
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, info }),
    });
  } catch (err) {
    console.error("Failed to log error", err);
  }
}
