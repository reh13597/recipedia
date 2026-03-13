import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Indecisive from '../pages/Indecisive'

// Mock RecipeCard to isolate the integration test to Indecisive logic.
// Only render minimal UI to confirm data rendering.
vi.mock('../components/Search/RecipeCard', () => ({
  __esModule: true,
  default: ({ name }) => (
    <div data-testid="random-recipe">
      <h2>{name}</h2>
    </div>
  ),
}))

// Spy on global.fetch for each test
beforeEach(() => {
  vi.spyOn(global, 'fetch')
})

// Restore mocks after each test to avoid test bleed
afterEach(() => {
  vi.restoreAllMocks()
})

describe('Indecisive integration', () => {

  it('fetches and displays three recipes on button click', async () => {
    // Mock three successful meal responses
    const mockMeals = [
      { strMeal: 'Meal1', strMealThumb: 'img1', strCategory: 'Cat1', strArea: 'Area1', strInstructions: 'Inst1', strIngredient1: 'Ing1', strMeasure1: '1 unit' },
      { strMeal: 'Meal2', strMealThumb: 'img2', strCategory: 'Cat2', strArea: 'Area2', strInstructions: 'Inst2', strIngredient1: 'Ing2', strMeasure1: '2 units' },
      { strMeal: 'Meal3', strMealThumb: 'img3', strCategory: 'Cat3', strArea: 'Area3', strInstructions: 'Inst3', strIngredient1: 'Ing3', strMeasure1: '3 units' },
    ]

    // Setup mocked fetch calls to return one meal each time
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ meals: [mockMeals[0]] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ meals: [mockMeals[1]] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ meals: [mockMeals[2]] }) })

    render(<Indecisive />)

    // Simulate user clicking the "Surprise Me!" button
    fireEvent.click(screen.getByRole('button', { name: /surprise me/i }))

    // Wait until loading indicator disappears
    await waitFor(() => {
      expect(screen.queryByText(/consulting the chefs/i)).not.toBeInTheDocument()
    })

    // Verify all three recipe names are rendered
    ;['Meal1', 'Meal2', 'Meal3'].forEach((meal) => {
      expect(screen.getByText(meal)).toBeInTheDocument()
    })

    // Ensure three SearchResult mock components rendered
    const cards = screen.getAllByTestId('random-recipe')
    expect(cards).toHaveLength(3)
  })

  it('displays error message when fetch fails', async () => {
    // Simulate failed fetch response
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 })

    render(<Indecisive />)

    // Simulate user click to trigger fetch
    fireEvent.click(screen.getByRole('button', { name: /surprise me/i }))

    // Expect error message to appear in the DOM
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch recipes/i)).toBeInTheDocument()
    })
  })
})
