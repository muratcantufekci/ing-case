import { LitElement, html, css } from "https://esm.run/lit";
import { employeeStore } from "../store/employeeStore.js";
import { languageManager, t } from "../utils/languageManager.js";
import "../components/delete-confirm-popup.js";
import "../components/pagination.js";

export class EmployeeList extends LitElement {
  static styles = css`
    .employee-list__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .employee-list__action {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .employee-list__action-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }

    .employee-list__action-icon:hover {
      opacity: 1;
    }

    .employee-list__action-icon--active {
      opacity: 1;
    }

    h1 {
      color: #ff6101;
      font-size: 20px;
    }

    .employee-list__grid {
      display: none;
      flex-wrap: wrap;
      gap: 20px;
    }

    .employee-list__grid--active {
      display: flex;
    }

    .employee-list__grid-item {
      width: 100%;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 14px;
    }

    .employee-list__grid-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .employee-list__grid-field {
      width: 50%;
    }

    .employee-list__grid-field span {
      font-size: 14px;
      color: #c6c5c5ff;
    }

    .employee-list__grid-field p {
      font-size: 16px;
      color: black;
      margin: 4px 0 0 0;
    }

    .employee-list__grid-buttons {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .employee-list__grid-button {
      display: flex;
      align-items: center;
      gap: 10px;
      border: none;
      padding: 6px 10px;
      border-radius: 8px;
      color: white;
      cursor: pointer;
    }

    .employee-list__grid-button--edit {
      background: #420290ff;
    }

    .employee-list__grid-button--delete {
      background: #fe4c01ff;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: block;
      overflow-x: scroll;
    }
    .table--hidden {
      display: none !important;
    }

    .table thead {
      background-color: #f8f9fa;
    }

    .table th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: #ff6101;
      font-size: 14px;
      border-bottom: 1px solid #e9ecef;
    }

    .table td {
      padding: 16px;
      border-bottom: 1px solid #f1f3f4;
      font-size: 14px;
      color: #333;
    }

    .table tbody tr {
      transition: background-color 0.2s ease;
    }

    .table tbody tr:hover {
      background-color: #fff8f5;
    }

    .table tbody tr:last-child td {
      border-bottom: none;
    }

    .actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .action-btn {
      padding: 6px;
      border: none;
      background: none;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.2s ease;
      color: #ff6101;
    }

    .action-btn:hover {
      background-color: #f8f9fa;
    }

    .action-btn svg {
      width: 18px;
      height: 18px;
    }

    @media (min-width: 768px) {
      h1 {
        font-size: 24px;
      }

      .employee-list__grid {
        gap: 50px;
      }

      .employee-list__grid-item {
        width: 40%;
        padding: 20px;
      }
    }

    @media (min-width: 1024px) {
      .table {
        display: table;
      }

      .employee-list__grid-item {
        width: 43%;
      }

      .employee-list__grid-field p {
        font-size: 18px;
      }
    }

    @media (min-width: 1440px) {
      .employee-list__grid-item {
        width: 45%;
      }
    }
  `;

  static properties = {
    employees: { type: Array },
    currentPage: { type: Number },
    pageSize: { type: Number },
    viewMode: { type: String },
    currentLanguage: { type: String },
  };

  constructor() {
    super();
    this.employees = [];
    this.currentPage = 1;
    this.pageSize = 10;
    this.viewMode = "table";
    this.currentLanguage = languageManager.getCurrentLanguage();
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.employees.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.employees.length / this.pageSize);
  }

  changePage(page) {
    this.currentPage = page;
  }

  switchToTableView() {
    this.viewMode = "table";
    this.requestUpdate();
  }

  switchToGridView() {
    this.viewMode = "grid";
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();

    this.employees = employeeStore.getState().employees;

    this.unsubscribe = employeeStore.subscribe((newState) => {
      this.employees = [...newState.employees];
      this.requestUpdate();
    });

    this.unsubscribeLanguage = languageManager.subscribe((language) => {
      this.currentLanguage = language;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) this.unsubscribe();
    if (this.unsubscribeLanguage) this.unsubscribeLanguage();
  }

  handleEdit(employee) {
    window.location.href = `/edit-employee.html?id=${employee.id}`;
  }

  handleDelete(employee) {
    const popup = document.createElement("delete-confirm-popup");

    popup.firstName = employee.firstName;
    popup.lastName = employee.lastName;

    popup.addEventListener("confirm-delete", () => {
      employeeStore.getState().removeEmployee(employee.id);
      alert(t("employeeDeleted"));
    });

    document.body.appendChild(popup);
  }

  render() {
    const t = (key) => languageManager.t(key);

    return html`
      <div class="employee-list">
        <div class="employee-list__head">
          <h1>${t("employeeList")}</h1>
          <div class="employee-list__action">
            <div
              class="employee-list__action-icon ${this.viewMode === "table"
                ? "employee-list__action-icon--active"
                : ""}"
              @click="${this.switchToTableView}"
              title="${t("employees")} ${this.currentLanguage === "tr"
                ? "Liste Görünümü"
                : "Table View"}"
            >
              <svg
                height="30px"
                width="30px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 50 50"
                enable-background="new 0 0 50 50"
                xml:space="preserve"
              >
                <path
                  fill="#ff6101"
                  d="M8.667,15h30c0.552,0,1-0.447,1-1s-0.448-1-1-1h-30c-0.552,0-1,0.447-1,1S8.114,15,8.667,15z"
                />
                <path
                  fill="#ff6101"
                  d="M8.667,37h30c0.552,0,1-0.447,1-1s-0.448-1-1-1h-30c-0.552,0-1,0.447-1,1S8.114,37,8.667,37z"
                />
                <path
                  fill="#ff6101"
                  d="M8.667,26h30c0.552,0,1-0.447,1-1s-0.448-1-1-1h-30c-0.552,0-1,0.447-1,1S8.114,26,8.667,26z"
                />
              </svg>
            </div>
            <div
              class="employee-list__action-icon ${this.viewMode === "grid"
                ? "employee-list__action-icon--active"
                : ""}"
              @click="${this.switchToGridView}"
              title="${t("employees")} ${this.currentLanguage === "tr"
                ? "Kart Görünümü"
                : "Grid View"}"
            >
              <svg
                fill="#ff6101"
                width="20px"
                height="20px"
                viewBox="0 0 32 32"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M30 32h-10c-1.105 0-2-0.895-2-2v-10c0-1.105 0.895-2 2-2h10c1.105 0 2 0.895 2 2v10c0 1.105-0.895 2-2 2zM30 20h-10v10h10v-10zM30 14h-10c-1.105 0-2-0.896-2-2v-10c0-1.105 0.895-2 2-2h10c1.105 0 2 0.895 2 2v10c0 1.104-0.895 2-2 2zM30 2h-10v10h10v-10zM12 32h-10c-1.105 0-2-0.895-2-2v-10c0-1.105 0.895-2 2-2h10c1.104 0 2 0.895 2 2v10c0 1.105-0.896 2-2 2zM12 20h-10v10h10v-10zM12 14h-10c-1.105 0-2-0.896-2-2v-10c0-1.105 0.895-2 2-2h10c1.104 0 2 0.895 2 2v10c0 1.104-0.896 2-2 2zM12 2h-10v10h10v-10z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <table class="table ${this.viewMode === "grid" ? "table--hidden" : ""}">
          <thead>
            <tr>
              <th>${t("firstName")}</th>
              <th>${t("lastName")}</th>
              <th>${t("dateOfEmployment")}</th>
              <th>${t("dateOfBirth")}</th>
              <th>${t("phone")}</th>
              <th>${t("email")}</th>
              <th>${t("department")}</th>
              <th>${t("position")}</th>
              <th>${t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            ${this.paginatedEmployees.map(
              (employee) => html`
                <tr>
                  <td>${employee.firstName}</td>
                  <td>${employee.lastName}</td>
                  <td>${employee.dateOfEmployment}</td>
                  <td>${employee.dateOfBirth}</td>
                  <td>${employee.phone}</td>
                  <td>${employee.email}</td>
                  <td>${employee.department}</td>
                  <td>${employee.position}</td>
                  <td>
                    <div class="actions">
                      <button
                        class="action-btn edit-btn"
                        @click="${() => this.handleEdit(employee)}"
                        title="${t("edit")} ${t("employees")}"
                      >
                        <svg
                          width="20px"
                          height="20px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 6L8 12V16H12L18 10M14 6L17 3L21 7L18 10M14 6L18 10M10 4L4 4L4 20L20 20V14"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        class="action-btn delete-btn"
                        @click="${() => this.handleDelete(employee)}"
                        title="${t("delete")} ${t("employees")}"
                      >
                        <svg
                          width="20px"
                          height="20px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 6.52381C3 6.12932 3.32671 5.80952 3.72973 5.80952H8.51787C8.52437 4.9683 8.61554 3.81504 9.45037 3.01668C10.1074 2.38839 11.0081 2 12 2C12.9919 2 13.8926 2.38839 14.5496 3.01668C15.3844 3.81504 15.4756 4.9683 15.4821 5.80952H20.2703C20.6733 5.80952 21 6.12932 21 6.52381C21 6.9183 20.6733 7.2381 20.2703 7.2381H3.72973C3.32671 7.2381 3 6.9183 3 6.52381Z"
                            fill="currentColor"
                          />
                          <path
                            d="M11.6066 22H12.3935C15.101 22 16.4547 22 17.3349 21.1368C18.2151 20.2736 18.3052 18.8576 18.4853 16.0257L18.7448 11.9452C18.8425 10.4086 18.8913 9.64037 18.4498 9.15352C18.0082 8.66667 17.2625 8.66667 15.7712 8.66667H8.22884C6.7375 8.66667 5.99183 8.66667 5.55026 9.15352C5.1087 9.64037 5.15756 10.4086 5.25528 11.9452L5.51479 16.0257C5.69489 18.8576 5.78494 20.2736 6.66513 21.1368C7.54532 22 8.89906 22 11.6066 22Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
        <div
          class="employee-list__grid ${this.viewMode === "grid"
            ? "employee-list__grid--active"
            : ""}"
        >
          ${this.paginatedEmployees.map(
            (employee) => html`
              <div class="employee-list__grid-item">
                <div class="employee-list__grid-row">
                  <div class="employee-list__grid-field">
                    <span>${t("firstName")}:</span>
                    <p>${employee.firstName}</p>
                  </div>
                  <div class="employee-list__grid-field">
                    <span>${t("lastName")}:</span>
                    <p>${employee.lastName}</p>
                  </div>
                </div>
                <div class="employee-list__grid-row">
                  <div class="employee-list__grid-field">
                    <span>${t("dateOfEmployment")}:</span>
                    <p>${employee.dateOfEmployment}</p>
                  </div>
                  <div class="employee-list__grid-field">
                    <span>${t("dateOfBirth")}:</span>
                    <p>${employee.dateOfBirth}</p>
                  </div>
                </div>
                <div class="employee-list__grid-row">
                  <div class="employee-list__grid-field">
                    <span>${t("phone")}:</span>
                    <p>${employee.phone}</p>
                  </div>
                  <div class="employee-list__grid-field">
                    <span>${t("email")}:</span>
                    <p>${employee.email}</p>
                  </div>
                </div>
                <div class="employee-list__grid-row">
                  <div class="employee-list__grid-field">
                    <span>${t("department")}:</span>
                    <p>${employee.department}</p>
                  </div>
                  <div class="employee-list__grid-field">
                    <span>${t("position")}:</span>
                    <p>${employee.position}</p>
                  </div>
                </div>
                <div class="employee-list__grid-buttons">
                  <button
                    class="employee-list__grid-button employee-list__grid-button--edit"
                    @click="${() => this.handleEdit(employee)}"
                  >
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 6L8 12V16H12L18 10M14 6L17 3L21 7L18 10M14 6L18 10M10 4L4 4L4 20L20 20V14"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    ${t("edit")}
                  </button>
                  <button
                    class="employee-list__grid-button employee-list__grid-button--delete"
                    @click="${() => this.handleDelete(employee)}"
                  >
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 6.52381C3 6.12932 3.32671 5.80952 3.72973 5.80952H8.51787C8.52437 4.9683 8.61554 3.81504 9.45037 3.01668C10.1074 2.38839 11.0081 2 12 2C12.9919 2 13.8926 2.38839 14.5496 3.01668C15.3844 3.81504 15.4756 4.9683 15.4821 5.80952H20.2703C20.6733 5.80952 21 6.12932 21 6.52381C21 6.9183 20.6733 7.2381 20.2703 7.2381H3.72973C3.32671 7.2381 3 6.9183 3 6.52381Z"
                        fill="currentColor"
                      />
                      <path
                        d="M11.6066 22H12.3935C15.101 22 16.4547 22 17.3349 21.1368C18.2151 20.2736 18.3052 18.8576 18.4853 16.0257L18.7448 11.9452C18.8425 10.4086 18.8913 9.64037 18.4498 9.15352C18.0082 8.66667 17.2625 8.66667 15.7712 8.66667H8.22884C6.7375 8.66667 5.99183 8.66667 5.55026 9.15352C5.1087 9.64037 5.15756 10.4086 5.25528 11.9452L5.51479 16.0257C5.69489 18.8576 5.78494 20.2736 6.66513 21.1368C7.54532 22 8.89906 22 11.6066 22Z"
                        fill="currentColor"
                      />
                    </svg>
                    ${t("delete")}
                  </button>
                </div>
              </div>
            `
          )}
        </div>
        <custom-pagination
          .currentPage="${this.currentPage}"
          .totalPages="${this.totalPages}"
          @page-change="${(e) => this.changePage(e.detail.page)}"
        >
        </custom-pagination>
      </div>
    `;
  }
}

customElements.define("employee-list", EmployeeList);
