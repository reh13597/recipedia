// src/Test/Search.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from '../pages/Search';
import { vi, describe, test, afterEach, expect } from 'vitest';


// These mocks remain the same as they correctly simulate user interaction.
vi.mock('../components/Search/SearchTopic', () => ({
  __esModule: true,
  default: ({ onSearch, setSearchType }) => (
    <button onClick={() => { onSearch('name', 'Test Meal'); setSearchType('name'); }}>
      Search
    </button>
  ),
}));
vi.mock('../components/Search/SearchHint', () => ({
  __esModule: true,
  default: () => <div>Hint</div>,
}));
vi.mock('../components/Search/RecipeCard', () => ({
  __esModule: true,
  default: ({ name }) => (
    <div data-testid="result">{name}</div>
  ),
}));


describe('Search component', () => {
  // This is the fake data that will be returned by our mocked API call.
  // It's structured to match the TheMealDB response format.
  const fakeMealDBResponse = {
    meals: [
      {
        strMeal: 'Test Meal',
        strMealThumb: 'https://example.com/thumb.jpg',
        strCategory: 'Test Category',
        strArea: 'Test Area',
        strInstructions: 'Do something.',
      }
    ]
  };

  // This runs before each test, clearing previous mocks.
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- TEST CASE 1: SUCCESSFUL SEARCH ---
  test('fetches and displays recipes on search', async () => {
    // We mock the global `fetch` function.
    // When the component calls fetch, this mock will intercept it.
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true, // Simulate a successful HTTP response
      json: async () => fakeMealDBResponse, // The response body will be our fake data
    });

    render(<Search />); // Render the component
    userEvent.click(screen.getByRole('button', { name: /search/i })); // Simulate a user clicking the search button

    // `waitFor` allows the component to finish its asynchronous fetch operation.
    await waitFor(() =>
      expect(screen.getByTestId('result')).toBeInTheDocument()
    );

    // Assert that the result is displayed correctly.
    expect(screen.getByTestId('result')).toHaveTextContent('Test Meal');

    // Assert that fetch was called with the correct TheMealDB URL for a 'name' search.
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.themealdb.com/api/json/v1/1/search.php?s=Test%20Meal'
    );
  });

  // --- TEST CASE 2: NO RECIPES FOUND ---
  test('shows a "no recipes found" error when the API returns no meals', async () => {
    // For this test, we mock a successful response, but with no meals property.
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ meals: null }), 
    });

    render(<Search />);
    userEvent.click(screen.getByRole('button', { name: /search/i }));

    // The test should now look for the exact error message the component renders in this scenario.
    await waitFor(() =>
      expect(
        screen.getByText('No recipes found. Try a different search term.')
      ).toBeInTheDocument()
    );
  });

  
  test('shows an error message when the fetch call fails', async () => {
    // Here, we simulate a network error by having the fetch promise reject.
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network failure'));

    render(<Search />);
    userEvent.click(screen.getByRole('button', { name: /search/i }));

    // When a fetch promise rejects, the component's `catch` block is executed.
    // We assert that the corresponding error message is displayed.
    await waitFor(() =>
      expect(
        screen.getByText('Something went wrong. Please try again.')
      ).toBeInTheDocument()
    );
  });
});