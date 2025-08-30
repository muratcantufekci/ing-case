import { LitElement, html, css } from "https://esm.run/lit";

export class CustomPagination extends LitElement {
  static properties = {
    currentPage: { type: Number },
    totalPages: { type: Number },
  };

  static styles = css`
    .pagination {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin: 16px 0;
    }

    button {
      border: none;
      border-radius: 100%;
      width: 30px;
      height: 30px;
      cursor: pointer;
      background: transparent;
    }

    button:disabled {
      opacity: 0.5;
      cursor: default;
    }

    button.active {
      background-color: #ff6101;
      color: white;
    }
      
    .pagination-next {
        transform: rotate(180deg);
    }
  `;

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
  }

  handleChangePage(page) {
    if (page < 1 || page > this.totalPages) return;
    this.dispatchEvent(
      new CustomEvent("page-change", {
        detail: { page },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="pagination">
        <button
          ?disabled="${this.currentPage === 1}"
          @click="${() => this.handleChangePage(this.currentPage - 1)}"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="24" fill="transparent" />
            <path
              d="M14.5 17L9.5 12L14.5 7"
              stroke="#ff6101"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        ${Array.from({ length: this.totalPages }, (_, i) => i + 1).map(
          (page) => html`
            <button
              class="${page === this.currentPage ? "active" : ""}"
              @click="${() => this.handleChangePage(page)}"
            >
              ${page}
            </button>
          `
        )}

        <button
          class="pagination-next"
          ?disabled="${this.currentPage === this.totalPages}"
          @click="${() => this.handleChangePage(this.currentPage + 1)}"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="24" fill="transparent" />
            <path
              d="M14.5 17L9.5 12L14.5 7"
              stroke="#ff6101"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    `;
  }
}

customElements.define("custom-pagination", CustomPagination);
