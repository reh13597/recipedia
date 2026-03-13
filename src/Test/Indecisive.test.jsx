import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Indecisive from "../pages/Indecisive";

// Mock the useRecipe hook so that components using it (like SearchResult) won't crash during testing
vi.mock("../Hooks/UseRecipe", () => ({
  __esModule: true,
  default: () => ({
    setSelectedRecipe: vi.fn(),
    selectedRecipe: null,
  }),
}));

// Fake recipe data returned from the mock API
const fakeMeal = {
  strMeal: "Test Meal",
  strMealThumb: "https://example.com/thumb.jpg",
  strCategory: "Test Category",
  strArea: "Test Area",
  strInstructions: "Do something.",
  strIngredient1: "Ingredient A",
  strMeasure1: "1 cup",
};

describe("Indecisive component", () => {
  // Set up successful fetch before each test
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ meals: [fakeMeal] }),
      })
    );
  });

  // Clean up mocks after each test
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("fetches 3 recipes on click and displays them", async () => {
    render(<Indecisive />);

    // Ensure the initial prompt is visible
    expect(
      screen.getByText(/feeling/i)
    ).toBeInTheDocument();

    // Click the "Surprise Me!" button
    await userEvent.click(screen.getByRole("button", { name: /surprise me/i }));

    // Expect three recipe cards with the fake title to render
    const headings = await screen.findAllByRole("heading", {
      name: /test meal/i,
    });
    expect(headings).toHaveLength(3);

    // Verify that fetch was called three times (once per recipe)
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  test("displays error message on fetch failure", async () => {
    // Override fetch to simulate a failed response
    global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 500 }));

    render(<Indecisive />);

    // Click the "Surprise Me!" button
    await userEvent.click(screen.getByRole("button", { name: /surprise me/i }));

    // Check that an error message is shown
    const err = await screen.findByText(
      /failed to fetch recipes\. please try again\./i
    );
    expect(err).toBeInTheDocument();
  });
});
