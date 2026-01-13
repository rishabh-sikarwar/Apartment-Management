/**
 * Parses a JSON string from MySQL into a JavaScript Array.
 * Safely handles nulls or invalid JSON.
 */
export function parseDatabaseArray(jsonString) {
  if (!jsonString) return [];
  try {
    // If it's already an array (in case we switch back to Postgres), return it
    if (Array.isArray(jsonString)) return jsonString;

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse database array:", error);
    return [];
  }
}

/**
 * Stringifies a JS Array for MySQL storage.
 */
export function prepareForDatabase(arrayData) {
  if (!arrayData) return "[]";
  return JSON.stringify(arrayData);
}
