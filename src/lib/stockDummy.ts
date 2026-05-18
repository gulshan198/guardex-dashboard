/** Shared stock / production dummy data (Stock page + daily report PDF). */

export const STOCK_PRODUCTION = {
  totalProduction: 12_450_000,
  todayProduction: 48_200,
  lastHourUnits: 3_420,
} as const;

export const STOCK_SEVEN_DAY = {
  totalAlerts: 82,
  avgUnitsPerDay: 45_400,
} as const;
