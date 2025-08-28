import { createStore } from "https://esm.run/zustand/vanilla";

const employees = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  firstName: `Name${i + 1}`,
  lastName: `Surname${i + 1}`,
  dateOfEmployment: `202${i % 4}-0${(i % 9) + 1}-15`,
  dateOfBirth: `1998-12-21`,
  phone: `+90 532 000 00 00`,
  email: `user${i + 1}@example.com`,
  department: ["HR", "IT", "Design", "Analytics"][i % 4],
  position: ["Junior", "Mid", "Senior"][i % 3],
}));

export const employeeStore = createStore((set) => ({
  employees,
  addEmployee: (employee) =>
    set((state) => ({ employees: [...state.employees, employee] })),
  removeEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((e) => e.id !== id),
    })),
}));
