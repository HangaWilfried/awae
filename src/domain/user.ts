import { TABLE_ROW } from "@/utils/enum";
import { RoleDTO, type EmployeeDTO } from "@/services/awae";
import { getLocalDateTime } from "@/utils/clock";

export class User {
  isNull: boolean;

  constructor(private user: EmployeeDTO) {
    this.isNull = false;
  }

  toString(data: unknown): string {
    return data?.toString() || "";
  }

  get id(): string {
    return this.toString(this.user.id);
  }

  set id(id: number) {
    this.user.id = id;
  }

  get email(): string {
    return this.toString(this.user.email);
  }

  get firstname(): string {
    return this.toString(this.user.firstname);
  }

  get lastname(): string {
    return this.toString(this.user.lastname);
  }

  get fullName(): string {
    return this.lastname + " " + this.firstname;
  }

  get dateOfBirth(): string {
    return this.toString(this.user.dateOfBirth);
  }

  get role(): string {
    switch (this.user.role) {
      case RoleDTO.ADMIN:
        return "admin";
      case RoleDTO.EMPLOYEE:
        return "employee";
      case RoleDTO.SUPER_ADMIN:
        return "super admin";
      default:
        return "";
    }
  }

  getTextFor(label: string): string {
    switch (label) {
      case TABLE_ROW.EMAIL:
        return this.email;
      case TABLE_ROW.FIRST_NAME:
        return this.firstname;
      case TABLE_ROW.LAST_NAME:
        return this.lastname;
      case TABLE_ROW.DATE_OF_BIRTH:
        return getLocalDateTime(this.dateOfBirth);
      case TABLE_ROW.ROLE:
        return this.role;
      default:
        return "-";
    }
  }
}

export const NullableUser = (): User => {
  const user = new User({});
  user.isNull = true;
  return user;
};
