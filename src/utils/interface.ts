import type { HolidayType } from "@/domain/config";

export interface ListItem<T> {
  get id(): number;
  get item(): T;
  get text(): string;
}

export class HolidayTypeItem implements ListItem<HolidayType> {
  constructor(private type: HolidayType) {}

  get id(): number {
    return +this.type.id;
  }

  get item(): HolidayType {
    return this.type;
  }

  get text(): string {
    return this.type.name;
  }
}
