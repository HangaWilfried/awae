import { HOLIDAY_STATUS } from "@/utils/enum";
import { User, NullableUser } from "@/domain/user";
import type { HolidayDTO, HolidayTypeDTO, PeriodDTO } from "@/services/awae";

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

  get description(): string {
    return getStringFrom(this.holiday.description);
  }

  get createdAt(): string {
    return getStringFrom(this.holiday.createdAt);
  }

  get status(): HOLIDAY_STATUS {
    if (this.holiday.status) {
      return HOLIDAY_STATUS[this.holiday.status as keyof typeof HOLIDAY_STATUS];
    }
    return HOLIDAY_STATUS.DRAFT;
  }

  get validity(): Period {
    if (this.holiday.period) {
      return new Period(this.holiday.period);
    }
    return NullablePeriod();
  }

  get type(): HolidayType {
    if (this.holiday.type) {
      return new HolidayType(this.holiday.type);
    }
    return NullableHolidayType();
  }

  get owner(): User {
    if (this.holiday.createdBy) {
      return new User(this.holiday.createdBy);
    }
    return NullableUser();
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

  get endDate(): string {
    return getStringFrom(this.period.endDate);
  }

  formatDate(t: (key: string) => string): string {
    return `${t("from")} ${this.startDate} ${t("to")} ${this.endDate}`;
  }
}

export class HolidayType {
  isNull: boolean;

  constructor(private type: HolidayTypeDTO) {
    this.isNull = false;
  }

  get id(): string {
    return getStringFrom(this.type.id);
  }

  get name(): string {
    return getStringFrom(this.type.name);
  }

  get description(): string {
    return getStringFrom(this.type.description);
  }
}

export const NullablePeriod = (): Period => {
  const period = new Period({});
  period.isNull = true;
  return period;
};

export const NullableHolidayType = (): HolidayType => {
  const type = new HolidayType({});
  type.isNull = true;
  return type;
};

export const NullableHoliday = (): Holiday => {
  const holiday = new Holiday({});
  holiday.isNull = true;
  return holiday;
};
