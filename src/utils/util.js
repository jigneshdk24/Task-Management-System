function formatStatusName(input) {
  // Remove leading/trailing spaces
  const trimmed = input.trim();

  // Split by spaces or underscores, capitalize each word, join with space
  const formatted = trimmed
    .toLowerCase()
    .split(/[\s_]+/) // split by space or underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return formatted;
}

function generateStatusCode(input) {
  if (!input || typeof input !== "string") return "";

  return input
    .trim() // remove leading/trailing spaces
    .split(/[\s_]+/) // split by spaces or underscores
    .join("_") // join with underscores
    .toUpperCase(); // convert everything to uppercase
}

module.exports = {
  formatStatusName,
  generateStatusCode,
  defaultStatuses: () => [
    { code: "TO_DO", name: "To Do" },
    { code: "IN_PROGRESS", name: "In Progress" },
    { code: "DONE", name: "Done" },
    { code: "BLOCKED", name: "Blocked" },
  ],
};
