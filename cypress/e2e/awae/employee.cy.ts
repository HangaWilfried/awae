import { utilsMocks } from "../../utils/stubs";

const {
  stubLogin,
  stubAccessToken,
  stubMyHolidays,
  stubHolidayCreate,
  stubAllHolidaysList,
  stubHolidayDetails,
  stubHolidaysTypes,
  stubUnPublishHoliday,
  stubPublishHoliday,
  stubActivatedHolidayConfigByHolidayType,
} = utilsMocks();

describe("Login as user with role employee", () => {
  it("should render correctly", () => {
    stubAccessToken();
    stubMyHolidays();
    stubAllHolidaysList();
    stubLogin();
    cy.get("[data-test='In coming']").click();
    cy.wait("@allHolidaysList");
    cy.get("[data-test='Private']").click();
    cy.wait("@myHolidays");
    stubHolidayDetails();
    cy.get("[data-test='holiday-3']").click();
    cy.get("[data-test='closeModalBtn']").click();
    cy.get("[data-test='holiday-4']").click();
    cy.get("[data-test='closeModalBtn']").click();
    cy.get("[data-test='holiday-5']").click();
    cy.get("[data-test='closeModalBtn']").click();
    cy.get("[data-test='holiday-6']").click();
    stubHolidaysTypes();
    cy.get("[data-test='closeModalBtn']").click();
    cy.get("[data-test='+ Add new request']").click();
    stubUnPublishHoliday();
    stubPublishHoliday();
    stubActivatedHolidayConfigByHolidayType();
    stubHolidayCreate();
    cy.get("[data-test='titleField']").type("Holiday request");
    cy.get("[data-test='DescriptionField']").type("I really need it");
    cy.get("[data-test='display-Type-list']").click();
    cy.get("[data-test='option-Congé Annuel (Vacation Leave)']").click();
    cy.get(".dp__input").eq(1).click();
    cy.get(".dp__cell_inner").eq(2).click();
    cy.get(".dp__input").eq(0).click();
    cy.get(".dp__cell_inner").eq(6).click();
    cy.get("[data-test='Create']").click();
  });
});
