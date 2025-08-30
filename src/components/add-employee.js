import { LitElement, html, css } from "https://esm.run/lit";
import { employeeStore } from "../store/employeeStore.js";
import { t, subscribe, getCurrentLanguage } from "../utils/languageManager.js";

export class AddEmployee extends LitElement {
  static properties = {
    firstName: { type: String },
    lastName: { type: String },
    dateOfEmployment: { type: Date },
    dateOfBirth: { type: Date },
    phone: { type: String },
    email: { type: String },
    department: { type: String },
    position: { type: String },
    employeeId: { type: Number, reflect: true },
    isEditing: { type: Boolean, reflect: true },
    currentLanguage: { type: String },
  };

  static styles = css`
    .add-employee {
      background: white;
      padding: 20px;
      margin-top: 20px;
    }

    .add-employee__title {
      color: #ff6101;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .add-employee__wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    .add-employee__input {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }

    .add-employee__input label {
      font-weight: 500;
      color: #333;
    }

    .add-employee__input input {
      width: 94%;
      height: 30px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .add-employee__input select {
      width: 100%;
      height: 48px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .add-employee__buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 50px;
      margin-top: 60px;
    }

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      width: 200px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .add-employee__save {
      background: #ff6101;
      color: white;
    }

    .add-employee__save:hover {
      background: #e55000;
    }

    .add-employee__cancel {
      background: white;
      color: black;
      border: 1px solid black;
    }

    .add-employee__cancel:hover {
      background: #f5f5f5;
    }

    @media (min-width: 768px) {
      .add-employee {
        background: white;
        padding: 40px 40px 120px;
        margin-top: 40px;
      }

      .add-employee__title {
        font-size: 24px;
      }

      .add-employee__wrapper {
        gap: 50px;
      }

      .add-employee__input {
        width: 45%;
      }
    }

    @media (min-width: 1440px) {
      .add-employee__wrapper {
        gap: 65px;
      }

      .add-employee__input {
        width: 30%;
      }

      .add-employee__input input {
        width: 60%;
      }

      .add-employee__input select {
        width: 60%;
      }
    }
  `;

  constructor() {
    super();
    this.firstName = "";
    this.lastName = "";
    this.dateOfEmployment = "";
    this.dateOfBirth = "";
    this.phone = "";
    this.email = "";
    this.department = "";
    this.position = "";
    this.isEditing = false;
    this.currentLanguage = getCurrentLanguage();
    this.languageUnsubscribe = null;
  }

  connectedCallback() {
    super.connectedCallback();

    this.languageUnsubscribe = subscribe((language) => {
      this.currentLanguage = language;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.languageUnsubscribe) {
      this.languageUnsubscribe();
    }
  }

  updated(changedProps) {
    if (changedProps.has("employeeId") || changedProps.has("isEditing")) {
      if (this.isEditing && this.employeeId != null) {
        const employee = employeeStore
          .getState()
          .employees.find((emp) => emp.id === this.employeeId);
        if (employee) {
          this.firstName = employee.firstName;
          this.lastName = employee.lastName;
          this.dateOfEmployment = employee.dateOfEmployment;
          this.dateOfBirth = employee.dateOfBirth;
          this.phone = employee.phone;
          this.email = employee.email;
          this.department = employee.department;
          this.position = employee.position;
        }
      }
    }
  }

  formPostHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (this.isEditing) {
      employeeStore.getState().updateEmployee(this.employeeId, {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        dateOfEmployment: formData.get("dateOfEmployment"),
        dateOfBirth: formData.get("dateOfBirth"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        department: formData.get("department"),
        position: formData.get("position"),
      });
      alert(t("employeeUpdated"));
    } else {
      const currentEmployees = employeeStore.getState().employees;
      const newId =
        currentEmployees.length > 0
          ? Math.max(...currentEmployees.map((emp) => emp.id)) + 1
          : 1;

      const newEmployee = {
        id: newId,
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        dateOfEmployment: formData.get("dateOfEmployment"),
        dateOfBirth: formData.get("dateOfBirth"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        department: formData.get("department"),
        position: formData.get("position"),
      };

      employeeStore.getState().addEmployee(newEmployee);
      alert(t("employeeAdded"));
    }

    e.target.reset();
    window.location.href = "/employees.html";
  }

  getPositionOptions() {
    return [
      { value: "", text: t("selectPosition") || "Select Position" },
      { value: "Junior", text: "Junior" },
      { value: "Mid", text: "Mid" },
      { value: "Senior", text: "Senior" },
    ];
  }

  render() {
    const positionOptions = this.getPositionOptions();

    return html`
      <div class="add-employee">
        <h2 class="add-employee__title">
          ${this.isEditing ? t("editEmployee") : t("addEmployee")}
        </h2>

        <form @submit=${(e) => this.formPostHandler(e)}>
          <div class="add-employee__wrapper">
            <div class="add-employee__input">
              <label>${t("firstName")}</label>
              <input
                type="text"
                name="firstName"
                .value="${this.firstName}"
                placeholder="${t("firstName")}"
                required
              />
            </div>
            <div class="add-employee__input">
              <label>${t("lastName")}</label>
              <input
                type="text"
                name="lastName"
                .value="${this.lastName}"
                placeholder="${t("lastName")}"
                required
              />
            </div>
            <div class="add-employee__input">
              <label>${t("dateOfEmployment")}</label>
              <input
                type="date"
                name="dateOfEmployment"
                .value="${this.dateOfEmployment}"
                required
              />
            </div>
            <div class="add-employee__input">
              <label>${t("dateOfBirth")}</label>
              <input
                type="date"
                name="dateOfBirth"
                .value="${this.dateOfBirth}"
                required
              />
            </div>
            <div class="add-employee__input">
              <label>${t("phone")}</label>
              <input
                type="tel"
                name="phone"
                .value="${this.phone}"
                placeholder="${t("phone")}"
                pattern="(05[0-9]{2}(?: [0-9]{2,4}){4}|0[0-9]{3}(?: [0-9]{2,4}){3}|[0-9]{10}|[0-9]{3}(?: [0-9]{2,4}){3})"
                title="phone"
                required
              />
            </div>
            <div class="add-employee__input">
              <label>${t("email")}</label>
              <input
                type="email"
                name="email"
                .value="${this.email}"
                placeholder="${t("email")}"
                required
              />
            </div>
            <div class="add-employee__input">
              <label>${t("department")}</label>
              <input
                type="text"
                name="department"
                .value="${this.department}"
                placeholder="${t("department")}"
                required
              />
            </div>
            <div class="add-employee__input">
              <label>${t("position")}</label>
              <select name="position" .value="${this.position}" required>
                ${positionOptions.map(
                  (option) => html`
                    <option
                      value="${option.value}"
                      ?selected="${this.position === option.value}"
                    >
                      ${option.text}
                    </option>
                  `
                )}
              </select>
            </div>
          </div>
          <div class="add-employee__buttons">
            <button class="add-employee__save" type="submit">
              ${t("save")}
            </button>
            <button
              class="add-employee__cancel"
              type="button"
              @click=${() => (window.location.href = "/employees.html")}
            >
              ${t("cancel")}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define("add-employee", AddEmployee);
