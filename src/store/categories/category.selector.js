import { createSelector } from 'reselect';

const selectCategoryReducer = (state) => {
  return state.categories;
};

// Memoized the categories state
// Selector only runs when the categories state is changing
export const selectCategories = createSelector(
  [selectCategoryReducer],
  (categoriesSlice) => {
    return categoriesSlice.categories;
  }
);

export const selectCategoriesMap = createSelector(
  [selectCategories],
  (categories) => {
    return categories.reduce((acc, category) => {
      const { title, items } = category;
      acc[title.toLowerCase()] = items;
      return acc;
    }, {});
  }
);
