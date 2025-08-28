import { LitElement, html, css } from "https://esm.run/lit";
import { employeeStore } from "../store/employeeStore.js";

export class EmployeeList extends LitElement {
  static styles = css`
    .employee-list {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-top: 30px;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
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
    }

    .action-btn:hover {
      background-color: #f8f9fa;
    }

    .action-btn svg {
      width: 18px;
      height: 18px;
    }

    .edit-btn {
      color: #ff6101;
    }

    .delete-btn {
      color: #dc3545;
    }

    @media (max-width: 768px) {
      .table {
        font-size: 12px;
      }

      .table th,
      .table td {
        padding: 8px;
      }

      .table th:nth-child(4),
      .table td:nth-child(4),
      .table th:nth-child(5),
      .table td:nth-child(5) {
        display: none;
      }
    }
  `;

  static properties = {
    employees: { type: Array },
  };

  constructor() {
    super();
    this.employees = [];
  }

  connectedCallback() {
    super.connectedCallback();

    this.employees = employeeStore.getState().employees;

    this.unsubscribe = employeeStore.subscribe((newState) => {
      this.employees = [...newState.employees];
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) this.unsubscribe();
  }

  handleCheckboxChange(employee, event) {
    this.dispatchEvent(
      new CustomEvent("employee-select", {
        detail: { employee, selected: event.target.checked },
        bubbles: true,
        composed: true,
      })
    );
  }

  handleEdit(employee) {
    this.dispatchEvent(
      new CustomEvent("employee-edit", {
        detail: { employee },
        bubbles: true,
        composed: true,
      })
    );
  }

  handleDelete(employee) {
    employeeStore.getState().removeEmployee(employee.id);

  }

  render() {
    return html`
      <div class="employee-list">
        <table class="table">
          <thead>
            <tr>
              <th></th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Date of Employment</th>
              <th>Date of Birth</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${(this.employees ?? []).map(
              (employee) => html`
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      class="checkbox"
                      @change="${(e) => this.handleCheckboxChange(employee, e)}"
                    />
                  </td>
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
                        title="Edit Employee"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path
                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                          />
                        </svg>
                      </button>
                      <button
                        class="action-btn delete-btn"
                        @click="${() => this.handleDelete(employee)}"
                        title="Delete Employee"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path
                            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
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
      </div>
    `;
  }
}

customElements.define("employee-list", EmployeeList);
