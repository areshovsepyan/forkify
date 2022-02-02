import 'core-js/stable';
import 'regenerator-runtime/runtime.js';

import * as model from './model.js';
import { getSearchResultsPage, state } from './model.js';

import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import recipeView from './views/recipeView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';


const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1. Update results view to mark selected search result and bookmarks
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 2. Loading the recipe
    await model.loadRecipe(id);

    // 3. Rendering the recipe
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
    await model.loadSearchResults(query);

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
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function() {
  // 1. Add / Remove a bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
};

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();

const clearBookmarks = function() {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

