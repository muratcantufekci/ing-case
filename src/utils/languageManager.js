const keywords = {
  tr: {
    employees: "Çalışanlar",
    addNew: "Yeni Ekle",
    employeeList: "Çalışan Listesi",
    firstName: "Ad",
    lastName: "Soyad",
    dateOfEmployment: "İşe Giriş Tarihi",
    dateOfBirth: "Doğum Tarihi",
    phone: "Telefon",
    email: "E-posta",
    department: "Departman",
    position: "Pozisyon",
    actions: "İşlemler",
    edit: "Düzenle",
    delete: "Sil",
    save: "Kaydet",
    cancel: "İptal",
    deleteConfirmation: "Silme Onayı",
    deleteMessage: "Bu çalışanı silmek istediğinizden emin misiniz?",
    confirm: "Onayla",
    employeeAdded: "Çalışan başarıyla eklendi",
    employeeUpdated: "Çalışan başarıyla güncellendi",
    employeeDeleted: "Çalışan başarıyla silindi",
    selectPosition: "Pozisyon Seçiniz",
    addEmployee: "Çalışan Ekle",
    editEmployee: "Çalışanı Düzenle"
  },

  en: {
    employees: "Employees",
    addNew: "Add New",
    employeeList: "Employee List",
    firstName: "First Name",
    lastName: "Last Name",
    dateOfEmployment: "Date of Employment",
    dateOfBirth: "Date of Birth",
    phone: "Phone",
    email: "Email",
    department: "Department",
    position: "Position",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    deleteConfirmation: "Delete Confirmation",
    deleteMessage: "Are you sure you want to delete this employee?",
    confirm: "Confirm",
    employeeAdded: "Employee added successfully",
    employeeUpdated: "Employee updated successfully",
    employeeDeleted: "Employee deleted successfully",
    selectPosition: "Select Position",
    addEmployee: "Add Employee",
    editEmployee: "Edit Employee"
  },
};

let currentLanguage = localStorage.getItem("language") || "tr";
let subscribers = [];

export const getCurrentLanguage = () => currentLanguage;

export const setLanguage = (language) => {
  if (keywords[language]) {
    currentLanguage = language;
    localStorage.setItem("language", language);
    subscribers.forEach((callback) => callback(language));
  }
};

export const translate = (key) => {
  const keys = key.split(".");
  let translation = keywords[currentLanguage];

  for (const k of keys) {
    if (translation && typeof translation === "object") {
      translation = translation[k];
    } else {
      break;
    }
  }

  return translation || key;
};

export const t = translate;

export const subscribe = (callback) => {
  subscribers.push(callback);

  return () => {
    const index = subscribers.indexOf(callback);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  };
};

document.addEventListener("language-change", (event) => {
  setLanguage(event.detail.language);
});

export const languageManager = {
  getCurrentLanguage,
  setLanguage,
  translate,
  t,
  subscribe,
};
