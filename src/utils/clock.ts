import dayjs from "dayjs";
import { DATE_FORMAT } from "@/utils/enum";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const getUTC = (date?: string): string => {
  return dayjs(date).utc().format();
};

export const getLocalDateTime = (
  date: string,
  format = DATE_FORMAT.DATE_TIME,
): string => {
  return dayjs(date).utc(true).local().format(format);
};
