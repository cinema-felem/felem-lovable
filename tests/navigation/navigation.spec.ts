import { test, expect } from '@playwright/test';

test.describe('Navigation and Page Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate between main pages', async ({ page }) => {
    // Test navigation to Cinemas page
    await page.click('text=Cinemas');
    await expect(page).toHaveURL('/cinemas');
    
    // Test navigation to Stats page
    await page.click('text=Stats');
    await expect(page).toHaveURL('/stats');
    
    // Test navigation back to Home
    await page.click('text=Home');
    await expect(page).toHaveURL('/');
  });

  test('should navigate to movie details from movie card', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    
    // Click on first movie card
    const firstMovieCard = page.locator('[data-testid="movie-card"]').first();
    await firstMovieCard.click();
    
    // Verify we're on movie details page
    await expect(page).toHaveURL(/\/movie\/\d+$/);
    
    // Check for movie details content
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to cinema details from cinemas page', async ({ page }) => {
    await page.goto('/cinemas');
    
    // Wait for cinema cards to load
    await page.waitForSelector('a[href*="/cinemas/"]', { timeout: 10000 });
    
    // Click on first cinema
    const firstCinema = page.locator('a[href*="/cinemas/"]').first();
    await firstCinema.click();
    
    // Verify we're on cinema details page
    await expect(page).toHaveURL(/\/cinemas\/\d+$/);
  });

  test('should handle back navigation', async ({ page }) => {
    // Navigate to movie details
    await page.waitForSelector('[data-testid="movie-card"]');
    await page.locator('[data-testid="movie-card"]').first().click();
    
    // Go back
    await page.goBack();
    
    // Should be back on home page
    await expect(page).toHaveURL('/');
  });

  test('should maintain navigation state', async ({ page }) => {
    // Navigate to different pages
    await page.goto('/cinemas');
    await page.goto('/stats');
    await page.goto('/');
    
    // Verify we can still navigate
    await page.click('text=Cinemas');
    await expect(page).toHaveURL('/cinemas');
  });

  test('should handle direct URL access', async ({ page }) => {
    // Test direct access to movie details
    await page.goto('/movie/1');
    await expect(page).toHaveURL('/movie/1');
    
    // Test direct access to cinemas
    await page.goto('/cinemas');
    await expect(page).toHaveURL('/cinemas');
    
    // Test direct access to stats
    await page.goto('/stats');
    await expect(page).toHaveURL('/stats');
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/non-existent-page');
    
    // Should show 404 or error page
    await expect(page.locator('h1, h2')).toBeVisible();
  });

  test('should have working breadcrumbs if present', async ({ page }) => {
    // Navigate to movie details
    await page.waitForSelector('[data-testid="movie-card"]');
    await page.locator('[data-testid="movie-card"]').first().click();
    
    // Check for breadcrumbs (if implemented)
    const breadcrumbs = page.locator('[data-testid="breadcrumbs"], nav[aria-label*="breadcrumb"]');
    if (await breadcrumbs.count() > 0) {
      await expect(breadcrumbs).toBeVisible();
      
      // Test breadcrumb navigation
      const homeLink = breadcrumbs.locator('a[href="/"]');
      if (await homeLink.count() > 0) {
        await homeLink.click();
        await expect(page).toHaveURL('/');
      }
    }
  });

  test('should handle search functionality', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[aria-label*="search"]');
    
    if (await searchInput.count() > 0) {
      await searchInput.fill('test movie');
      await searchInput.press('Enter');
      
      // Should navigate to search results
      await expect(page).toHaveURL(/\/search/);
    }
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Should focus on first interactive element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test keyboard navigation to movie details
    await page.waitForSelector('[data-testid="movie-card"]');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Should navigate to movie details
    await expect(page).toHaveURL(/\/movie\/\d+$/);
  });

  test('should handle mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Test mobile navigation
    await page.click('text=Cinemas');
    await expect(page).toHaveURL('/cinemas');
    
    await page.click('text=Stats');
    await expect(page).toHaveURL('/stats');
    
    await page.click('text=Home');
    await expect(page).toHaveURL('/');
  });
}); 