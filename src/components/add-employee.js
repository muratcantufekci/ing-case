import { LitElement, html, css } from "https://esm.run/lit";
import { employeeStore } from "../store/employeeStore.js";

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
  };

  static styles = css`
    .add-employee {
      background: white;
      padding: 40px 40px 120px;
      margin-top: 40px;
    }
    .add-employee__wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 65px;
    }
    .add-employee__input {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 30%;
    }
    .add-employee__input input {
      width: 60%;
      height: 30px;
    }
    .add-employee__input select {
      width: 60%;
      height: 36px;
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
    }
    .add-employee__save {
      background: #ff6101;
      color: white;
    }
    .add-employee__cancel {
      background: white;
      color: black;
      border: 1px solid black;
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
      alert("Employee güncellendi!");
    } else {
      const currentEmployees = employeeStore.getState().employees;
      const newId = Math.max(...currentEmployees.map((emp) => emp.id)) + 1;

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
      alert(
        `Employee eklendi: ${newEmployee.firstName} ${newEmployee.lastName}`
      );
    }

    e.target.reset();
    window.location.href = "/employees.html";
  }

  render() {
    return html`
      <div class="add-employee">
        <form @submit=${(e) => this.formPostHandler(e)}>
        ${this.isEditing ? html`<h5>You are editing ${this.firstName} ${this.lastName}</h5>` : ""}
          <div class="add-employee__wrapper">
            <div class="add-employee__input">
              <span>First Name</span>
              <input
                type="text"
                name="firstName"
                .value="${this.firstName}"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div class="add-employee__input">
              <span>Last Name</span>
              <input
                type="text"
                name="lastName"
                .value="${this.lastName}"
                placeholder="Enter your last name"
                required
              />
            </div>
            <div class="add-employee__input">
              <span>Date of Employment</span>
              <input
                type="date"
                name="dateOfEmployment"
                .value="${this.dateOfEmployment}"
                required
              />
            </div>
            <div class="add-employee__input">
              <span>Date of Birth</span>
              <input
                type="date"
                name="dateOfBirth"
                .value="${this.dateOfBirth}"
                required
              />
            </div>
            <div class="add-employee__input">
              <span>Phone</span>
              <input
                type="tel"
                name="phone"
                .value="${this.phone}"
                placeholder="Enter your phone number"
                pattern="(05[0-9]{2}(?: [0-9]{2,4}){4}|0[0-9]{3}(?: [0-9]{2,4}){3}|[0-9]{10}|[0-9]{3}(?: [0-9]{2,4}){3})"
                title="Geçerli formatlar: 05357456609, 0535 745 6609, 5357456609, 535 745 6609"
                required
              />
            </div>
            <div class="add-employee__input">
              <span>Email</span>
              <input
                type="email"
                name="email"
                .value="${this.email}"
                placeholder="Enter your email"
                required
              />
            </div>
            <div class="add-employee__input">
              <span>Department</span>
              <input
                type="text"
                name="department"
                .value="${this.department}"
                placeholder="Enter your department"
                required
              />
            </div>
            <div class="add-employee__input">
              <span>Position</span>
              <select name="position" .value="${this.position}" required>
                <option value="" disabled selected hidden>Seçiniz</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>
          <div class="add-employee__buttons">
            <button class="add-employee__save" type="submit">Save</button>
            <button
              class="add-employee__cancel"
              type="button"
              @click=${() => (window.location.href = "/employees.html")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define("add-employee", AddEmployee);
