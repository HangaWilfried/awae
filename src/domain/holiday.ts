import { HOLIDAY_STATUS } from "@/utils/enum";
import { NullableUser, User } from "@/domain/user";
import type {
  CreationHolidayDTO,
  HolidayDTO,
  PeriodDTO,
} from "@/services/awae";
import { HolidayType, NullableHolidayType } from "@/domain/config";
import { getLocalDateTime } from "@/utils/clock";

const getStringFrom = (data?: string | number): string => {
  return data?.toString() || "";
};

export class Holiday {
  isNull: boolean;
  constructor(private holiday: HolidayDTO) {
    this.isNull = false;
  }

  get id(): string {
    return getStringFrom(this.holiday.id);
  }

  get title(): string {
    return getStringFrom(this.holiday.title);
  }

  set title(title: string) {
    this.holiday.title = title;
  }

  get description(): string {
    return getStringFrom(this.holiday.description);
  }

  set description(description: string) {
    this.holiday.description = description;
  }

  get createdAt(): string {
    return getLocalDateTime(getStringFrom(this.holiday.createdAt));
  }

  get status(): HOLIDAY_STATUS {
    if (this.holiday.status) {
      return HOLIDAY_STATUS[this.holiday.status as keyof typeof HOLIDAY_STATUS];
    }
    return HOLIDAY_STATUS.DRAFT;
  }

  get isDraft(): boolean {
    return this.status === HOLIDAY_STATUS.DRAFT;
  }

  get isClose(): boolean {
    return (
      this.status === HOLIDAY_STATUS.REFUSED ||
      this.status === HOLIDAY_STATUS.VALIDATED ||
      this.status === HOLIDAY_STATUS.PASSED ||
      this.status === HOLIDAY_STATUS.IN_PROGRESS
    );
  }

  get validity(): Period {
    if (this.holiday.period) {
      return new Period(this.holiday.period);
    }
    return NullablePeriod();
  }

  set validity(period: Period) {
    this.holiday.period = period.DTO;
  }

  get type(): HolidayType {
    if (this.holiday.type) {
      return new HolidayType(this.holiday.type);
    }
    return NullableHolidayType();
  }

  set type(type: HolidayType) {
    this.holiday.type = type.DTO;
  }

  get owner(): User {
    if (this.holiday.createdBy) {
      return new User(this.holiday.createdBy);
    }
    return NullableUser();
  }

  static build(state: HolidayForm): CreationHolidayDTO {
    return {
      title: state.title,
      type: +state.type.id,
      description: state.description,
      period: {
        endDate: state.to,
        startDate: state.from,
      },
    };
  }

  get DTO(): HolidayDTO {
    return this.holiday;
  }
}

export class Period {
  isNull: boolean;
  constructor(private period: PeriodDTO) {
    this.isNull = false;
  }

  get startDate(): string {
    return getStringFrom(this.period.startDate);
  }

  set startDate(date) {
    this.period.startDate = date;
  }

  get endDate(): string {
    return getStringFrom(this.period.endDate);
  }

  set endDate(date) {
    this.period.endDate = date;
  }

  formatDate(t: (key: string) => string): string {
    return `${t("from")} ${getLocalDateTime(this.startDate)} ${t("to")} ${getLocalDateTime(this.endDate)}`;
  }

  get DTO(): PeriodDTO {
    return this.period;
  }
}

export const NullablePeriod = (): Period => {
  const period = new Period({});
  period.isNull = true;
  return period;
};

export const NullableHoliday = (): Holiday => {
  const holiday = new Holiday({});
  holiday.isNull = true;
  return holiday;
};

export type HolidayForm = {
  title: string;
  type: HolidayType;
  description: string;
  from: string;
  to: string;
};
