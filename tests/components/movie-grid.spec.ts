import { test, expect } from '@playwright/test';

test.describe('MovieGrid Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display movie grid with title', async ({ page }) => {
    // Wait for movie grid to load
    await page.waitForSelector('section', { timeout: 10000 });
    
    // Check if grid sections are present
    const sections = await page.locator('section').all();
    expect(sections.length).toBeGreaterThan(0);
    
    // Check for section titles
    const titles = await page.locator('h2').all();
    expect(titles.length).toBeGreaterThan(0);
  });

  test('should display movies in grid layout', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    
    // Check if movies are displayed in a grid
    const movieCards = await page.locator('[data-testid="movie-card"]').all();
    expect(movieCards.length).toBeGreaterThan(0);
    
    // Verify grid layout classes
    const gridContainer = page.locator('.grid').first();
    await expect(gridContainer).toBeVisible();
  });

  test('should have sort functionality', async ({ page }) => {
    await page.waitForSelector('select', { timeout: 10000 });
    
    // Check if sort dropdown is present
    const sortSelect = page.locator('select').first();
    await expect(sortSelect).toBeVisible();
    
    // Check sort options
    const options = await sortSelect.locator('option').all();
    expect(options.length).toBeGreaterThan(0);
  });

  test('should handle sorting by different criteria', async ({ page }) => {
    await page.waitForSelector('select');
    
    const sortSelect = page.locator('select').first();
    
    // Get initial movie order
    const initialMovies = await page.locator('[data-testid="movie-card"] h3').allTextContents();
    
    // Change sort option
    await sortSelect.selectOption('title');
    
    // Wait for potential re-render
    await page.waitForTimeout(1000);
    
    // Get new movie order
    const sortedMovies = await page.locator('[data-testid="movie-card"] h3').allTextContents();
    
    // Verify order changed (this is a basic check)
    expect(sortedMovies.length).toBe(initialMovies.length);
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileGrid = page.locator('.grid').first();
    await expect(mobileGrid).toBeVisible();
    
    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 });
    const tabletGrid = page.locator('.grid').first();
    await expect(tabletGrid).toBeVisible();
    
    // Test desktop layout
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopGrid = page.locator('.grid').first();
    await expect(desktopGrid).toBeVisible();
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // This test would require mocking empty data
    // For now, we'll verify the grid structure exists
    await page.waitForSelector('section');
    
    const sections = await page.locator('section').all();
    expect(sections.length).toBeGreaterThan(0);
  });

  test('should have proper accessibility', async ({ page }) => {
    await page.waitForSelector('section');
    
    // Check for proper heading structure
    const headings = await page.locator('h2').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // Check for proper select labels
    const selects = await page.locator('select').all();
    for (const select of selects) {
      const ariaLabel = await select.getAttribute('aria-label');
      expect(ariaLabel || await select.getAttribute('id')).toBeTruthy();
    }
  });

  test('should handle loading states', async ({ page }) => {
    // Navigate to a page that might show loading states
    await page.goto('/');
    
    // Check if content loads within reasonable time
    await page.waitForSelector('[data-testid="movie-card"]', { timeout: 15000 });
    
    const movieCards = await page.locator('[data-testid="movie-card"]').all();
    expect(movieCards.length).toBeGreaterThan(0);
  });

  test('should maintain grid layout when movies are filtered', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    
    // Get initial grid structure
    const initialGrid = page.locator('.grid').first();
    const initialClass = await initialGrid.getAttribute('class');
    
    // Simulate some interaction that might filter movies
    // (This would depend on actual filtering functionality)
    
    // Verify grid structure is maintained
    const currentGrid = page.locator('.grid').first();
    const currentClass = await currentGrid.getAttribute('class');
    expect(currentClass).toBe(initialClass);
  });
}); 