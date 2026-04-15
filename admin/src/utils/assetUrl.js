const trimSlashes = (value) => value.replace(/^\/+|\/+$/g, "");

export const getAssetUrl = (path) => {
  if (!path) return "";

  const baseUrl = import.meta.env.VITE_DEV_BACKEND_URL || "";
  const origin = baseUrl.replace(/\/api\/?$/, "");

  return `${origin.replace(/\/+$/, "")}/${trimSlashes(path)}`;
};

export default getAssetUrl;
