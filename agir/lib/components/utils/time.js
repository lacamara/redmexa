import { DateTime, Interval } from "luxon";
import { instanceOf } from "prop-types";

import I18N from "@agir/lib/i18n";

const HOUR_ONLY_FORMAT = {
  hour: "numeric",
  minute: "2-digit",
};

const SAME_YEAR_FORMAT = {
  weekday: "long",
  month: "long",
  day: "numeric",
};

const OTHER_YEAR_FORMAT = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export function dateFromISOString(isostring, zone) {
  return zone
    ? DateTime.fromISO(isostring, { zone }).setLocale(I18N.locale)
    : DateTime.fromISO(isostring).setLocale(I18N.locale);
}

export function displayHumanDay(datetime, relativeTo, interval) {
  if (!instanceOf(datetime, DateTime)) {
    return datetime;
  }

  if (relativeTo === undefined) {
    relativeTo = DateTime.local();
  }

  if (interval === undefined) {
    interval =
      relativeTo < datetime
        ? Interval.fromDateTimes(relativeTo, datetime)
        : Interval.fromDateTimes(datetime, relativeTo);
  }

  const calendarDays = interval.count("days");

  if (calendarDays <= 3) {
    return datetime.toRelativeCalendar({
      base: relativeTo,
      unit: "days",
    });
  } else if (calendarDays <= 8) {
    const calendarWeeks = interval.count("weeks");
    const qualifier =
      relativeTo < datetime ? (calendarWeeks > 1 ? "proximo" : "") : "pasado";
    return `${datetime.weekdayLong} ${qualifier}`.trim();
  }

  const format = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: datetime.year !== relativeTo.year ? "numeric" : undefined,
  };

  return datetime.toLocaleString(format);
}

export function displayHumanDate(datetime, relativeTo) {
  if (!instanceOf(datetime, DateTime)) {
    return datetime;
  }

  if (relativeTo === undefined) {
    relativeTo = DateTime.local();
  }
  const interval =
    relativeTo < datetime
      ? Interval.fromDateTimes(relativeTo, datetime)
      : Interval.fromDateTimes(datetime, relativeTo);

  const calendarDays = interval.count("days");

  const time = datetime.toLocaleString(HOUR_ONLY_FORMAT);
  let date = "";

  if (calendarDays <= 8) {
    date = displayHumanDay(datetime, relativeTo, interval);
  } else if (interval.count("months") <= 4) {
    date = datetime.toLocaleString(SAME_YEAR_FORMAT);
  } else {
    date = datetime.toLocaleString(OTHER_YEAR_FORMAT);
  }

  return `${date} a las ${time}`;
}

export const displayHumanDateString = (datetime, relativeTo) => {
  datetime = new Date(datetime);
  datetime = DateTime.fromJSDate(datetime).setLocale(I18N.locale);

  if (relativeTo) {
    relativeTo = new Date(relativeTo);
    relativeTo = DateTime.fromJSDate(relativeTo).setLocale(I18N.locale);
  }

  return displayHumanDate(datetime, relativeTo);
};

export function displayInterval(interval, relativeTo) {
  if (relativeTo === undefined) {
    relativeTo = DateTime.local().setLocale(I18N.locale);
  }

  const fromNowInterval =
    relativeTo < interval.start
      ? Interval.fromDateTimes(relativeTo, interval.start)
      : Interval.fromDateTimes(interval.start, relativeTo);

  const showYear = fromNowInterval.count("months") > 4;
  const scheduleCalendarDays = interval.count("days");

  const dayPartFormat = {
    year: showYear ? "numeric" : undefined,
    month: "long",
    day: "numeric",
    weekday: "long",
  };

  if (scheduleCalendarDays === 1) {
    const dayPart = interval.start.toLocaleString(dayPartFormat);
    const hourPart = `de ${interval.start.toLocaleString(
      HOUR_ONLY_FORMAT,
    )} a ${interval.end.toLocaleString(HOUR_ONLY_FORMAT)}`;
    return `${dayPart}, ${hourPart}`;
  }

  const startDate = interval.start.toLocaleString(dayPartFormat);
  const startTime = interval.start.toLocaleString(HOUR_ONLY_FORMAT);
  const endDate = interval.end.toLocaleString({
    ...dayPartFormat,
    year: undefined,
  });
  const endTime = interval.end.toLocaleString(HOUR_ONLY_FORMAT);
  return `de ${startDate} a las ${startTime} hasta ${endDate} a las ${endTime}`;
}

export function displayIntervalStart(interval, relativeTo) {
  if (relativeTo === undefined) {
    relativeTo = DateTime.local().setLocale(I18N.locale);
  }
  const startDate = interval.start.setLocale(I18N.locale);
  const endDate = interval.end.setLocale(I18N.locale);
  const scheduleCalendarDays = interval.count("days");

  const dayPartFormat = {
    year: endDate < relativeTo ? "numeric" : undefined,
    month: "long",
    day: "numeric",
  };

  if (scheduleCalendarDays === 1) {
    const dayPart = startDate.toLocaleString(dayPartFormat);
    const hourPart = `${startDate.toLocaleString(HOUR_ONLY_FORMAT)}`;

    return `${dayPart}, ${hourPart}`;
  }

  const start = startDate.toLocaleString({
    ...dayPartFormat,
    ...HOUR_ONLY_FORMAT,
  });

  return `${start}`;
}

export function displayIntervalEnd(interval, relativeTo) {
  if (relativeTo === undefined) {
    relativeTo = DateTime.local().setLocale(I18N.locale);
  }

  const startDate = DateTime.now();
  const endDate = interval.end.setLocale(I18N.locale);
  const beforeEnd = Interval.fromISO(`${startDate}/${endDate}`);
  const diffBetween = beforeEnd.count("days");

  let title = "En curso, ";

  const dayPartFormat = {
    year: endDate < relativeTo ? "numeric" : undefined,
    month: "long",
    day: "numeric",
  };

  if (diffBetween === 1) {
    title += "hasta ";
    const hourPart = `${endDate.toLocaleString(HOUR_ONLY_FORMAT)}`;
    return `${title} ${hourPart}`;
  }

  if (diffBetween < 7) {
    title += "hasta ";
    return `${title}` + displayHumanDate(endDate);
  }

  title += "hasta el ";

  const end = endDate.toLocaleString({
    ...dayPartFormat,
    ...HOUR_ONLY_FORMAT,
  });

  return `${title} ${end}`;
}

const units = ["year", "month", "week", "day", "hour", "minute", "second"];

export const simpleDate = (datetimeString, hideCurrentYear = true) => {
  let dateTime = new Date(datetimeString);
  dateTime = DateTime.fromJSDate(dateTime).setLocale(I18N.locale);
  return dateTime.toLocaleString({
    year:
      hideCurrentYear && new Date().getFullYear() === dateTime.get("year")
        ? undefined
        : "numeric",
    month: "long",
    day: "numeric",
  });
};

export const simpleDateTime = (datetimeString, hideCurrentYear = true) => {
  let dateTime = new Date(datetimeString);
  dateTime = DateTime.fromJSDate(dateTime).setLocale(I18N.locale);
  return dateTime.toLocaleString({
    year:
      hideCurrentYear && new Date().getFullYear() === dateTime.get("year")
        ? undefined
        : "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    ...HOUR_ONLY_FORMAT,
  });
};

export const timeAgo = (date, maxUnit = units[0]) => {
  try {
    let dateTime = new Date(date);
    dateTime = DateTime.fromJSDate(dateTime).setLocale(I18N.locale);
    const diff = dateTime.diffNow().shiftTo(...units);
    const unit = units.find((unit) => diff.get(unit) !== 0) || "second";
    if (maxUnit && units.indexOf(maxUnit) > units.indexOf(unit)) {
      return simpleDate(date);
    }
    const relativeFormatter = new Intl.RelativeTimeFormat(I18N.datetimeLocale, {
      numeric: "auto",
    });
    return relativeFormatter.format(Math.trunc(diff.as(unit)), unit);
  } catch (e) {
    return date;
  }
};

export const displayShortDate = (datetime) => {
  try {
    let date = new Date(datetime);
    date = DateTime.fromJSDate(date).setLocale(I18N.locale);
    return date.toFormat("dd/LL");
  } catch (e) {
    return datetime;
  }
};
