import icons from 'url:../../img/icons.svg';


export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const markUp = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  update(data) {
    this._data = data;
    const newMarkUp = this._generateMarkup();

    const newElements = Array
      .from(document
        .createRange()
        .createContextualFragment(newMarkUp)
        .querySelectorAll('*'));

    const currentElements = Array
      .from(this._parentElement
        .querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];

      // Changes TEXT
      if (!newEl.isEqualNode(curEl) && newEl.firstChild.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent;
      }

      // Changes ATTRIBUTE
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value));
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markUp = `
     <div class='spinner'>
        <svg>
          <use href='${icons}#icon-loader'></use>
        </svg>
     </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  };

  renderError(message = this._errorMessage) {
    const markUp = `
        <div class='error'>
           <div>
             <svg>
               <use href='${icons}#icon-alert-triangle'></use>
             </svg>
           </div>
           <p>${message}</p>
        </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  renderMessage(message = this._message) {
    const markUp = `
     <div class='recipe'>
        <div class='message'>
            <div>
                <svg>
                    <use href='${icons}#icon-smile'></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

}