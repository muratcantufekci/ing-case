import { createStore } from "https://esm.run/zustand/vanilla";

const employees = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  firstName: `Name${i + 1}`,
  lastName: `Surname${i + 1}`,
  dateOfEmployment: `202${i % 4}-0${(i % 9) + 1}-15`,
  dateOfBirth: `1998-12-21`,
  phone: `0532 000 00 00`,
  email: `user${i + 1}@example.com`,
  department: ["HR", "IT", "Design", "Analytics"][i % 4],
  position: ["Junior", "Mid", "Senior"][i % 3],
}));

const loadFromStorage = () => {
  const stored = localStorage.getItem("employees");
  return stored ? JSON.parse(stored) : employees;
};

const saveToStorage = (employees) => {
  localStorage.setItem("employees", JSON.stringify(employees));
};

export const employeeStore = createStore((set) => ({
  employees: loadFromStorage(),
  addEmployee: (employee) =>
    set((state) => {
      const newEmployees = [employee, ...state.employees];
      saveToStorage(newEmployees);
      return { employees: newEmployees };
    }),
  removeEmployee: (id) =>
    set((state) => {
      const newEmployees = state.employees.filter((e) => e.id !== id);
      saveToStorage(newEmployees);
      return { employees: newEmployees };
    }),
  updateEmployee: (id, editedEmployee) =>
    set((state) => {
      const newEmployees = state.employees.map((e) =>
        e.id === id ? { ...e, ...editedEmployee } : e
      );
      saveToStorage(newEmployees);
      return { employees: newEmployees };
    }),
}));
