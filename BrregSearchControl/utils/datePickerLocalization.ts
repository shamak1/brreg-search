import { defaultDatePickerStrings } from '@fluentui/react-datepicker-compat';
import type { CalendarStrings } from '@fluentui/react-datepicker-compat';
import { IInputs } from '../generated/ManifestTypes';
import { getString } from './translationHelper';

export const getDatePickerStringsFromResx = (
  context: ComponentFramework.Context<IInputs>
): CalendarStrings => {
  return {
    ...defaultDatePickerStrings,
    months: [
      getString(context, 'date.month.january'),
      getString(context, 'date.month.february'),
      getString(context, 'date.month.march'),
      getString(context, 'date.month.april'),
      getString(context, 'date.month.may'),
      getString(context, 'date.month.june'),
      getString(context, 'date.month.july'),
      getString(context, 'date.month.august'),
      getString(context, 'date.month.september'),
      getString(context, 'date.month.october'),
      getString(context, 'date.month.november'),
      getString(context, 'date.month.december')
    ],
    shortMonths: [
      getString(context, 'date.month.jan'),
      getString(context, 'date.month.feb'),
      getString(context, 'date.month.mar'),
      getString(context, 'date.month.apr'),
      getString(context, 'date.month.may'),
      getString(context, 'date.month.jun'),
      getString(context, 'date.month.jul'),
      getString(context, 'date.month.aug'),
      getString(context, 'date.month.sep'),
      getString(context, 'date.month.oct'),
      getString(context, 'date.month.nov'),
      getString(context, 'date.month.dec')
    ],
    days: [
      getString(context, 'date.day.sunday'),
      getString(context, 'date.day.monday'),
      getString(context, 'date.day.tuesday'),
      getString(context, 'date.day.wednesday'),
      getString(context, 'date.day.thursday'),
      getString(context, 'date.day.friday'),
      getString(context, 'date.day.saturday')
    ],
    shortDays: [
      getString(context, 'date.day.sun'),
      getString(context, 'date.day.mon'),
      getString(context, 'date.day.tue'),
      getString(context, 'date.day.wed'),
      getString(context, 'date.day.thu'),
      getString(context, 'date.day.fri'),
      getString(context, 'date.day.sat')
    ],
    goToToday: getString(context, 'goToToday'),
    prevMonthAriaLabel: getString(context, 'prevMonthAriaLabel'),
    nextMonthAriaLabel: getString(context, 'nextMonthAriaLabel'),
    prevYearAriaLabel: getString(context, 'prevYearAriaLabel'),
    nextYearAriaLabel: getString(context, 'nextYearAriaLabel'),
    closeButtonAriaLabel: getString(context, 'closeButtonAriaLabel'),
    monthPickerHeaderAriaLabel: getString(context, 'monthPickerHeaderAriaLabel'),
    yearPickerHeaderAriaLabel: getString(context, 'yearPickerHeaderAriaLabel'),
  };
};

export const createDateFormatterFromResx = (
  context: ComponentFramework.Context<IInputs>
) => {
  const strings = getDatePickerStringsFromResx(context);
  
  return (date?: Date): string => {
    if (!date) return '';
    
    return `${strings.months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };
};