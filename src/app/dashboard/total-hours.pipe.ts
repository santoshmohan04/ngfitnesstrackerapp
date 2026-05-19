import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'totalHours',
  standalone: true
})
export class TotalHoursPipe implements PipeTransform {
  transform(items: any[] | null | undefined, durationKey: string = 'minutes'): string {
    // 1. Strict check for a valid array
    if (!Array.isArray(items) || items.length === 0) {
      return '0.00';
    }

    // 2. Safely parse and accumulate total minutes
    const totalMinutes = items.reduce((acc, item) => {
      if (!item) return acc;
      const durationRaw = item[durationKey] ?? 0;
      const parsedDuration = typeof durationRaw === 'string' ? parseFloat(durationRaw) : Number(durationRaw);
      return acc + (Number.isNaN(parsedDuration) ? 0 : parsedDuration);
    }, 0);

    // 3. Convert to hours and format safely
    const hours = totalMinutes / 60;
    return Number.isNaN(hours) ? '0.00' : hours.toFixed(2);
  }
}