import dayjs from "dayjs";
import { DATE_FORMAT } from "@/utils/enum";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const getUTC = (
  date: string,
  format = DATE_FORMAT.YEAR_MONTH_DAY,
): string => {
  return dayjs(date).utc().format(format);
};

export const getLocalDateTime = (
  date: string,
  format = DATE_FORMAT.DATE_TIME,
): string => {
  return dayjs(date).utc(true).local().format(format);
};
