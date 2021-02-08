const fallbackApiHost =
  process.env.NODE_ENV === "development"
    ? "https://localhost:5001"
    : "https://pigofpigs-api.azurewebsites.net";

export const apiHost =
  process.env.REACT_APP_API_HOST || fallbackApiHost;
