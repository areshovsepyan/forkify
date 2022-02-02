import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE
  },
  bookmarks: []
};

export const loadRecipe = async function(id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients
    };

    state.bookmarks.some(bookmark => bookmark.id === id) ? state.recipe.bookmarked = true : state.recipe.bookmarked = false;

  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function(query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url
      };
    });
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function(page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * newServings / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function(recipe) {
  // Add bookmark (in state)
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    this.state.recipe.bookmarked = true;
  }
};

export const deleteBookmark = function(id) {
  // Locate and remove bookmark (in state)
  const index = this.state.bookmarks.findIndex(element => element.id === id);
  this.state.bookmarks.splice(index, 1);

  // Unmark current recipe as bookmarked
  if (id === state.recipe.id) {
    this.state.recipe.bookmarked = false;
  }

};












