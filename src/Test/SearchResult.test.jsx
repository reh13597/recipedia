import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchResult from '../components/Search/RecipeCard';

// Mocking the setSelectedRecipe function from the custom hook
const mockSetSelectedRecipe = vi.fn();
const sampleRecipe = {
  name: 'Mock Dish',
  area: 'Italian',
  category: 'Main Course',
  image: 'https://example.com/image.jpg',
  instructions: 'Cook everything together.',
  ingredients: [
    { name: 'Pasta', measure: '100g' },
    { name: 'Cheese', measure: '50g' },
  ],
};

// Mocking the custom hook to control its return values
vi.mock('../Hooks/UseRecipe.js', () => ({
  default: () => ({
    selectedRecipe: sampleRecipe,
    setSelectedRecipe: mockSetSelectedRecipe,
  }),
}));

// Test suite for API calls within the SearchResult component
describe('SearchResult API call test', () => {
  // Set up a mock for the global fetch function before each test
  beforeEach(() => {
    // Mock fetch to return a successful response with specific nutrition data
    global.fetch = vi.fn(() => {
      return Promise.resolve({
        ok: true, 
        json: () =>
          Promise.resolve([
            {
              calories: 300,
              fat_total_g: 10,
              protein_g: 20,
              sodium_mg: 500,
              potassium_mg: 400,
              cholesterol_mg: 50,
              carbohydrates_total_g: 60,
              fiber_g: 5,
              sugar_g: 3,
            },
          ]),
      });
    });
  });

  // Clear all mocks after each test to prevent state pollution
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test case: opening the modal triggers nutrition data fetching and displays the results
  it('fetches nutrition data when modal is opened and displays results', async () => {
    render(
      <SearchResult
        name="Mock Dish"
        image={sampleRecipe.image}
        area={sampleRecipe.area}
        category={sampleRecipe.category}
        recipeData={sampleRecipe}
      />
    );

    // Simulate a user click to open the modal
    fireEvent.click(screen.getByText(/Mock Dish/i));

    // Wait for the modal content to appear and the fetch calls to complete
    await waitFor(() => {
      // Find the nutrition block by its title
      const nutritionHeading = screen.getByText('Nutrition');
      const nutritionBlock = nutritionHeading.closest('div');
      
      // Assert that the nutrition block exists and contains the expected content
      expect(nutritionBlock).toBeTruthy();
      expect(screen.getByText('Total Fat')).toBeInTheDocument();
      expect(screen.getByText('Sodium')).toBeInTheDocument();
      expect(screen.getByText('Cholesterol')).toBeInTheDocument();
      expect(screen.getByText('Calories')).toBeInTheDocument();
      
      // Check for values
      expect(screen.getByText('300')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    // Assert that the fetch function was called once with all ingredients joined by \n
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent('100g Pasta\n50g Cheese')),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Api-Key': expect.any(String),
        }),
      })
    );
  });
});