import 'core-js/stable';
import 'regenerator-runtime/runtime.js';

import * as model from './model.js';
import { getSearchResultsPage, state } from './model.js';

import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import recipeView from './views/recipeView.js';
import paginationView from './views/paginationView.js';


const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1. Loading the recipe
    await model.loadRecipe(id);

    // 2. Rendering the recipe
    recipeView.render(model.state.recipe);

  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function() {
  try {
    // 0. Spinner on search
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search results
    await model.leadSearchResults(query);

    // 3. Render results
    // resultsView.render(state.search.results);
    resultsView.render(getSearchResultsPage());

    // 4. Render the initial pagination buttons
    paginationView.render(state.search);


  } catch (error) {
    throw error;
  }
};

const controlPagination = function(goToPage) {
  resultsView.render(getSearchResultsPage(goToPage));
  paginationView.render(state.search);
};

const controlServings = function(newServings) {
  // Update the recipe serving (state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.render(model.state.recipe);

};

const init = function() {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();


