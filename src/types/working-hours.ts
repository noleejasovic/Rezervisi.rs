export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

export const DayOfWeekLabels: Record<DayOfWeek, string> = {
  [DayOfWeek.MONDAY]: 'Ponedeljak',
  [DayOfWeek.TUESDAY]: 'Utorak',
  [DayOfWeek.WEDNESDAY]: 'Sreda',
  [DayOfWeek.THURSDAY]: 'Četvrtak',
  [DayOfWeek.FRIDAY]: 'Petak',
  [DayOfWeek.SATURDAY]: 'Subota',
  [DayOfWeek.SUNDAY]: 'Nedelja'
};

export interface WorkingHours {
  id: string;
  salon_id: string;
  day_of_week: DayOfWeek;
  is_open: boolean;
  open_time?: string; // Format: "09:00"
  close_time?: string; // Format: "18:00"
}

export interface WorkingHoursInput {
  day_of_week: DayOfWeek;
  is_open: boolean;
  open_time?: string;
  close_time?: string;
}
