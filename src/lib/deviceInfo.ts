// Device and location detection utilities

export interface DeviceInfo {
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  screenResolution: string;
  language: string;
  timezone: string;
  platform: string;
}

export interface LocationInfo {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  city?: string;
  country?: string;
  error?: string;
}

export const getDeviceInfo = (): DeviceInfo => {
  const userAgent = navigator.userAgent;
  
  // Browser detection
  let browser = 'Unknown';
  if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
  else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
  else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';
  else if (userAgent.indexOf('Opera') > -1) browser = 'Opera';

  // OS detection
  let os = 'Unknown';
  if (userAgent.indexOf('Windows') > -1) os = 'Windows';
  else if (userAgent.indexOf('Mac') > -1) os = 'macOS';
  else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
  else if (userAgent.indexOf('Android') > -1) os = 'Android';
  else if (userAgent.indexOf('iOS') > -1) os = 'iOS';

  // Device type detection
  let device = 'Desktop';
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    device = 'Mobile';
  }
  if (/iPad/i.test(userAgent)) {
    device = 'Tablet';
  }

  return {
    userAgent,
    browser,
    os,
    device,
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    platform: navigator.platform,
  };
};

export const getLocation = async (): Promise<LocationInfo> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ error: 'Geolocation not supported' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Get location details using reverse geocoding API
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          resolve({
            latitude,
            longitude,
            accuracy,
            city: data.city || data.locality || 'Unknown',
            country: data.countryName || 'Unknown',
          });
        } catch (error) {
          resolve({
            latitude,
            longitude,
            accuracy,
            error: 'Could not fetch location details',
          });
        }
      },
      (error) => {
        resolve({ 
          error: `Location error: ${error.message}` 
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export const getVisitorInfo = () => {
  const stored = localStorage.getItem('visitorGateInfo');
  return stored ? JSON.parse(stored) : null;
};
