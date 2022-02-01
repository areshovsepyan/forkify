import View from './View.js';
import icons from 'url:../../img/icons.svg';
import { NEXT_PAGE, PREV_PAGE } from '../config.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkupButton(type) {
    const currentPage = this._data.page;
    const boolNumber = type === NEXT_PAGE ? 1 : -1;
    const boolIcon = type === NEXT_PAGE ? 'right' : 'left';
    return `
          <button data-goto='${currentPage + boolNumber}' class='btn--inline pagination__btn--${type}'>
              <svg class='search__icon'>
                <use href='${icons}#icon-arrow-${boolIcon}'></use>
              </svg>
              <span>Page ${currentPage + boolNumber}</span>
            </button>
    `;
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

    // Page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupButton(NEXT_PAGE);
    }

    // Last page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupButton(PREV_PAGE);
    }

    // Other page
    if (currentPage < numPages) {
      return `
           ${this._generateMarkupButton(PREV_PAGE)}
           ${this._generateMarkupButton(NEXT_PAGE)}
      `;
    }

    // Page 1, and there are NO other pages
    return '';
  }
}

export default new PaginationView();