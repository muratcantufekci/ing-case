import { LitElement, html, css } from "https://esm.run/lit";
import {
  t,
  subscribe,
  getCurrentLanguage,
  setLanguage,
} from "../utils/languageManager.js";

export class Header extends LitElement {
  static styles = css`
    .header {
      display: flex;
      justify-content: space-between;
      background-color: #ffffff;
      height: 60px;
      padding: 10px;
    }

    .header__img {
      width: 30px;
      height: 30px;
    }

    .header__left {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      text-decoration: none;
      color: black;
    }

    .header__right {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .header__item {
      display: flex;
      align-items: center;
      gap: 4px;
      text-decoration: none;
      color: #ff6101;
      opacity: 0.7;
      padding: 4px;
      border-radius: 6px;
      transition: all 0.2s ease;
      font-size: 12px;
    }

    .header__item:hover {
      opacity: 1;
    }

    .header__item.active {
      opacity: 1;
    }

    .header__item svg {
      width: 20px;
      height: 20px;
    }

    .header__language {
      position: relative;
    }

    .header__language-trigger {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      transition: all 0.2s ease;
      border: none;
      background: none;
    }

    .header__language-trigger:hover {
      background-color: #f5f5f5;
    }

    .header__language-trigger img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }

    .header__language-trigger span {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }

    .header__language-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      min-width: 160px;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
    }

    .header__language-dropdown--open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .header__language-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }

    .header__language-option:hover {
      background-color: #f8f9fa;
    }

    .header__language-option:first-child {
      border-radius: 8px 8px 0 0;
    }

    .header__language-option:last-child {
      border-radius: 0 0 8px 8px;
    }

    .header__language-option img {
      width: 20px;
      height: 20px;
      object-fit: contain;
    }

    .header__language-option span {
      font-size: 14px;
      color: #333;
    }

    .header__language-option--active {
      background-color: #fff8f5;
      color: #ff6101;
    }

    .header__language-option--active span {
      color: #ff6101;
      font-weight: 600;
    }

    /* Dropdown arrow */
    .header__language-trigger::after {
      content: "";
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid #666;
      transition: transform 0.2s ease;
    }

    .header__language-trigger--open::after {
      transform: rotate(180deg);
    }

    @media (min-width: 768px) {
      .header__img {
        width: 40px;
        height: 40px;
      }

      .header__left {
        gap: 20px;
      }

      .header__right {
        gap: 10px;
      }

      .header__item {
        padding: 8px 12px;
        font-size: 16px;
      }

      .header__item svg {
        width: 30px;
        height: 30px;
      }

      .header__language-trigger {
        gap: 8px;
        padding: 8px 12px;
      }
    }
  `;

  static properties = {
    currentLanguage: { type: String },
    dropdownOpen: { type: Boolean },
  };

  constructor() {
    super();
    this.currentLanguage = getCurrentLanguage();
    this.dropdownOpen = false;
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.languageUnsubscribe = null;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.handleClickOutside);

    this.languageUnsubscribe = subscribe((language) => {
      this.currentLanguage = language;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.handleClickOutside);

    if (this.languageUnsubscribe) {
      this.languageUnsubscribe();
    }
  }

  handleClickOutside(event) {
    if (
      !this.shadowRoot.querySelector(".header__language").contains(event.target)
    ) {
      this.dropdownOpen = false;
      this.requestUpdate();
    }
  }

  toggleDropdown(event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    this.requestUpdate();
  }

  selectLanguage(language, event) {
    event.stopPropagation();
    this.dropdownOpen = false;
    setLanguage(language);
    this.requestUpdate();
  }

  getCurrentPath() {
    const path = window.location.pathname;
    const filename = path.split("/").pop();
    return filename ? filename.replace(".html", "") : "";
  }

  isActive(itemId) {
    return this.getCurrentPath() === itemId;
  }

  getLanguageConfig() {
    return {
      tr: {
        flag: "../../src/assets/images/turkish-flag.png",
        name: "Türkçe",
        code: "TR",
      },
      en: {
        flag: "../../src/assets/images/english-flag.png",
        name: "English",
        code: "EN",
      },
    };
  }

  render() {
    const languageConfig = this.getLanguageConfig();

    return html`<div class="header">
      <a href="/" class="header__left">
        <img class="header__img" src="../../src/assets/images/logo.png" />
        <span>ING</span>
      </a>
      <div class="header__right">
        <a
          href="/employees.html"
          class="header__item ${this.isActive("employees") ? "active" : ""}"
        >
          <svg
            fill="#ff6101"
            height="800px"
            width="800px"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 330 330"
            xml:space="preserve"
          >
            <g id="XMLID_530_">
              <g id="XMLID_531_">
                <path
                  id="XMLID_532_"
                  d="M115,147.75c20.389,0,38.531-9.78,50-24.889c11.469,15.109,29.611,24.889,50,24.889
                  c34.601,0,62.75-28.149,62.75-62.75S249.601,22.25,215,22.25c-20.389,0-38.531,9.78-50,24.889
                  C153.531,32.03,135.389,22.25,115,22.25c-34.601,0-62.75,28.149-62.75,62.75S80.399,147.75,115,147.75z M215,52.25
                  c18.059,0,32.75,14.691,32.75,32.75s-14.691,32.75-32.75,32.75S182.25,103.059,182.25,85S196.941,52.25,215,52.25z M115,52.25
                  c18.059,0,32.75,14.691,32.75,32.75s-14.691,32.75-32.75,32.75S82.25,103.059,82.25,85S96.941,52.25,115,52.25z"
                />
              </g>
              <g id="XMLID_536_">
                <path
                  id="XMLID_782_"
                  d="M215,177.75c-17.373,0-34.498,3.942-50.022,11.44c-15.122-7.327-32.078-11.44-49.978-11.44
                  c-63.411,0-115,51.589-115,115c0,8.284,6.716,15,15,15h200h100c8.284,0,15-6.716,15-15C330,229.339,278.411,177.75,215,177.75z
                  M31.325,277.75c7.106-39.739,41.923-70,83.675-70s76.569,30.261,83.675,70H31.325z M229.021,277.75
                  c-3.45-26.373-15.873-49.96-34.092-67.597c6.539-1.583,13.277-2.403,20.07-2.403c41.751,0,76.569,30.261,83.675,70H229.021z"
                />
              </g>
            </g>
          </svg>
          ${t("employees")}
        </a>
        <a
          href="/add-employee.html"
          class="header__item ${this.isActive("add-employee") ? "active" : ""}"
        >
          <svg
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 12H20M12 4V20"
              stroke="#ff6101"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          ${t("addNew")}
        </a>

        <div class="header__language">
          <button
            class="header__language-trigger ${this.dropdownOpen
              ? "header__language-trigger--open"
              : ""}"
            @click="${this.toggleDropdown}"
          >
            <img
              src="${languageConfig[this.currentLanguage].flag}"
              alt="${languageConfig[this.currentLanguage].name}"
            />
            <span>${languageConfig[this.currentLanguage].code}</span>
          </button>

          <div
            class="header__language-dropdown ${this.dropdownOpen
              ? "header__language-dropdown--open"
              : ""}"
          >
            ${Object.entries(languageConfig).map(
              ([code, config]) => html`
                <button
                  class="header__language-option ${this.currentLanguage === code
                    ? "header__language-option--active"
                    : ""}"
                  @click="${(e) => this.selectLanguage(code, e)}"
                >
                  <img src="${config.flag}" alt="${config.name}" />
                  <span>${config.name}</span>
                </button>
              `
            )}
          </div>
        </div>
      </div>
    </div>`;
  }
}

customElements.define("custom-header", Header);
