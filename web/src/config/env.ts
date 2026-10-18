export const ENV_CONFIG = {
  RAILRADAR_API_KEY: import.meta.env.VITE_RAILRADAR_API_KEY || '',
  MAPTILER_API_KEY: import.meta.env.VITE_MAPTILER_API_KEY || '',
  OPENWEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
  OPENTOPOGRAPHY_API_KEY: import.meta.env.VITE_OPENTOPOGRAPHY_API_KEY || '',
};

export const hasValidKey = (key: string): boolean => {
  return typeof key === 'string' && key.trim().length > 0 && !key.includes('your_');
};
