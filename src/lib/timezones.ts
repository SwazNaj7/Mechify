// Comprehensive list of timezones with UTC offsets

export interface Timezone {
  value: string;
  label: string;
  offset: string;
}

export const TIMEZONES: Timezone[] = [
  // UTC
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: 'UTC+0' },
  
  // Americas
  { value: 'America/New_York', label: 'New York (Eastern Time)', offset: 'UTC-5' },
  { value: 'America/Chicago', label: 'Chicago (Central Time)', offset: 'UTC-6' },
  { value: 'America/Denver', label: 'Denver (Mountain Time)', offset: 'UTC-7' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (Pacific Time)', offset: 'UTC-8' },
  { value: 'America/Anchorage', label: 'Anchorage (Alaska Time)', offset: 'UTC-9' },
  { value: 'America/Honolulu', label: 'Honolulu (Hawaii Time)', offset: 'UTC-10' },
  { value: 'America/Toronto', label: 'Toronto (Eastern Time)', offset: 'UTC-5' },
  { value: 'America/Vancouver', label: 'Vancouver (Pacific Time)', offset: 'UTC-8' },
  { value: 'America/Mexico_City', label: 'Mexico City', offset: 'UTC-6' },
  { value: 'America/Bogota', label: 'Bogotá (Colombia Time)', offset: 'UTC-5' },
  { value: 'America/Lima', label: 'Lima (Peru Time)', offset: 'UTC-5' },
  { value: 'America/Santiago', label: 'Santiago (Chile Time)', offset: 'UTC-3' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (Argentina Time)', offset: 'UTC-3' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (Brazil Time)', offset: 'UTC-3' },
  { value: 'America/Caracas', label: 'Caracas (Venezuela Time)', offset: 'UTC-4' },
  { value: 'America/Panama', label: 'Panama', offset: 'UTC-5' },
  
  // Europe
  { value: 'Europe/London', label: 'London (GMT)', offset: 'UTC+0' },
  { value: 'Europe/Paris', label: 'Paris (Central European Time)', offset: 'UTC+1' },
  { value: 'Europe/Berlin', label: 'Berlin (Central European Time)', offset: 'UTC+1' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (Central European Time)', offset: 'UTC+1' },
  { value: 'Europe/Brussels', label: 'Brussels (Central European Time)', offset: 'UTC+1' },
  { value: 'Europe/Madrid', label: 'Madrid (Central European Time)', offset: 'UTC+1' },
  { value: 'Europe/Rome', label: 'Rome (Central European Time)', offset: 'UTC+1' },
  { value: 'Europe/Zurich', label: 'Zurich (Central European Time)', offset: 'UTC+1' },
  { value: 'Europe/Vienna', label: 'Vienna (Central European Time)', offset: 'UTC+1' },
  { value: 'Europe/Warsaw', label: 'Warsaw (Central European Time)', offset: 'UTC+1' },
  { value: 'Europe/Stockholm', label: 'Stockholm (Central European Time)', offset: 'UTC+1' },
  { value: 'Europe/Oslo', label: 'Oslo (Central European Time)', offset: 'UTC+1' },
  { value: 'Europe/Copenhagen', label: 'Copenhagen (Central European Time)', offset: 'UTC+1' },
  { value: 'Europe/Helsinki', label: 'Helsinki (Eastern European Time)', offset: 'UTC+2' },
  { value: 'Europe/Athens', label: 'Athens (Eastern European Time)', offset: 'UTC+2' },
  { value: 'Europe/Bucharest', label: 'Bucharest (Eastern European Time)', offset: 'UTC+2' },
  { value: 'Europe/Kiev', label: 'Kyiv (Eastern European Time)', offset: 'UTC+2' },
  { value: 'Europe/Moscow', label: 'Moscow (Moscow Time)', offset: 'UTC+3' },
  { value: 'Europe/Istanbul', label: 'Istanbul (Turkey Time)', offset: 'UTC+3' },
  
  // Asia
  { value: 'Asia/Dubai', label: 'Dubai (Gulf Standard Time)', offset: 'UTC+4' },
  { value: 'Asia/Karachi', label: 'Karachi (Pakistan Time)', offset: 'UTC+5' },
  { value: 'Asia/Kolkata', label: 'Mumbai/Delhi (India Time)', offset: 'UTC+5:30' },
  { value: 'Asia/Dhaka', label: 'Dhaka (Bangladesh Time)', offset: 'UTC+6' },
  { value: 'Asia/Bangkok', label: 'Bangkok (Indochina Time)', offset: 'UTC+7' },
  { value: 'Asia/Jakarta', label: 'Jakarta (Western Indonesia Time)', offset: 'UTC+7' },
  { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh City (Vietnam Time)', offset: 'UTC+7' },
  { value: 'Asia/Singapore', label: 'Singapore', offset: 'UTC+8' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong', offset: 'UTC+8' },
  { value: 'Asia/Shanghai', label: 'Shanghai (China Time)', offset: 'UTC+8' },
  { value: 'Asia/Taipei', label: 'Taipei (Taiwan Time)', offset: 'UTC+8' },
  { value: 'Asia/Manila', label: 'Manila (Philippines Time)', offset: 'UTC+8' },
  { value: 'Asia/Seoul', label: 'Seoul (Korea Time)', offset: 'UTC+9' },
  { value: 'Asia/Tokyo', label: 'Tokyo (Japan Time)', offset: 'UTC+9' },
  
  // Oceania
  { value: 'Australia/Perth', label: 'Perth (Australian Western Time)', offset: 'UTC+8' },
  { value: 'Australia/Adelaide', label: 'Adelaide (Australian Central Time)', offset: 'UTC+9:30' },
  { value: 'Australia/Sydney', label: 'Sydney (Australian Eastern Time)', offset: 'UTC+10' },
  { value: 'Australia/Melbourne', label: 'Melbourne (Australian Eastern Time)', offset: 'UTC+10' },
  { value: 'Australia/Brisbane', label: 'Brisbane (Australian Eastern Time)', offset: 'UTC+10' },
  { value: 'Pacific/Auckland', label: 'Auckland (New Zealand Time)', offset: 'UTC+12' },
  { value: 'Pacific/Fiji', label: 'Fiji', offset: 'UTC+12' },
  
  // Africa
  { value: 'Africa/Cairo', label: 'Cairo (Egypt Time)', offset: 'UTC+2' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (South Africa Time)', offset: 'UTC+2' },
  { value: 'Africa/Lagos', label: 'Lagos (West Africa Time)', offset: 'UTC+1' },
  { value: 'Africa/Nairobi', label: 'Nairobi (East Africa Time)', offset: 'UTC+3' },
  { value: 'Africa/Casablanca', label: 'Casablanca (Morocco Time)', offset: 'UTC+1' },
  
  // Middle East
  { value: 'Asia/Jerusalem', label: 'Jerusalem (Israel Time)', offset: 'UTC+2' },
  { value: 'Asia/Riyadh', label: 'Riyadh (Arabia Time)', offset: 'UTC+3' },
  { value: 'Asia/Tehran', label: 'Tehran (Iran Time)', offset: 'UTC+3:30' },
];

// Get timezone by value
export function getTimezone(value: string): Timezone | undefined {
  return TIMEZONES.find(tz => tz.value === value);
}

// Get default timezone (tries to detect from browser)
export function getDefaultTimezone(): string {
  if (typeof Intl !== 'undefined') {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (TIMEZONES.find(tz => tz.value === detected)) {
        return detected;
      }
    } catch {
      // Fallback to UTC
    }
  }
  return 'UTC';
}
