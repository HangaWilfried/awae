import { ROLE, utilsMocks } from "../../utils/stubs";

const {
  stubLogin,
  stubAccessToken,
  stubEmployeeAdd,
  stubEmployeeEdit,
  stubEmployeeList,
  fillEmployeeData,
  stubEmployeeDetails,
  stubPassword,
  stubEditPassword,
} = utilsMocks();

describe("Login as user with role admin", () => {
  it("should render correctly", () => {
    stubAccessToken(ROLE.ADMIN);
    stubLogin();
    stubEmployeeList();
    stubEmployeeAdd();
    stubPassword();
    stubEditPassword();
    stubEmployeeEdit();
    stubEmployeeDetails();
    fillEmployeeData();
  });
});
