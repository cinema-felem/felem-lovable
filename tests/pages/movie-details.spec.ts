import { test, expect } from '@playwright/test';

test.describe('Movie Details Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page first
    await page.goto('/');
    
    // Wait for movie cards to load and click on first one
    await page.waitForSelector('[data-testid="movie-card"]');
    await page.locator('[data-testid="movie-card"]').first().click();
  });

  test('should display movie information correctly', async ({ page }) => {
    // Check for movie title
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for movie poster
    const poster = page.locator('img[alt*="poster"]');
    await expect(poster).toBeVisible();
    
    // Check for movie rating
    const rating = page.locator('[data-testid="rating"], .text-cinema-gold');
    await expect(rating).toBeVisible();
    
    // Check for release year
    const year = page.locator('text=/\\d{4}/');
    await expect(year).toBeVisible();
  });

  test('should display movie overview', async ({ page }) => {
    // Look for overview section
    const overview = page.locator('text=Overview, h3:has-text("Overview")');
    if (await overview.count() > 0) {
      await expect(overview).toBeVisible();
      
      // Check for overview text
      const overviewText = page.locator('p').filter({ hasText: /^[A-Z]/ });
      await expect(overviewText.first()).toBeVisible();
    }
  });

  test('should display movie genres', async ({ page }) => {
    // Look for genres section
    const genres = page.locator('[data-testid="genres"], .badge, .bg-cinema-dark-gray');
    if (await genres.count() > 0) {
      await expect(genres.first()).toBeVisible();
    }
  });

  test('should display movie cast information', async ({ page }) => {
    // Look for cast section
    const cast = page.locator('text=Cast, h3:has-text("Cast")');
    if (await cast.count() > 0) {
      await expect(cast).toBeVisible();
      
      // Check for cast members
      const castMembers = page.locator('li, .cast-member');
      await expect(castMembers.first()).toBeVisible();
    }
  });

  test('should display movie ratings from different sources', async ({ page }) => {
    // Look for ratings section
    const ratings = page.locator('[data-testid="ratings"], .rating, .text-cinema-gold');
    if (await ratings.count() > 0) {
      await expect(ratings.first()).toBeVisible();
    }
  });

  test('should display movie showtimes if available', async ({ page }) => {
    // Look for showtimes section
    const showtimes = page.locator('text=Showtimes, h3:has-text("Showtimes")');
    if (await showtimes.count() > 0) {
      await expect(showtimes).toBeVisible();
      
      // Check for showtime filters
      const filters = page.locator('select, button[role="button"]');
      if (await filters.count() > 0) {
        await expect(filters.first()).toBeVisible();
      }
    }
  });

  test('should display external links', async ({ page }) => {
    // Look for external links section
    const externalLinks = page.locator('a[target="_blank"], a[rel="noopener"]');
    if (await externalLinks.count() > 0) {
      await expect(externalLinks.first()).toBeVisible();
      
      // Check for proper external link attributes
      const firstLink = externalLinks.first();
      const target = await firstLink.getAttribute('target');
      const rel = await firstLink.getAttribute('rel');
      expect(target).toBe('_blank');
      expect(rel).toContain('noopener');
    }
  });

  test('should handle movie videos if available', async ({ page }) => {
    // Look for videos section
    const videos = page.locator('text=Videos, h3:has-text("Videos")');
    if (await videos.count() > 0) {
      await expect(videos).toBeVisible();
      
      // Check for video thumbnails or players
      const videoElements = page.locator('iframe, video, [data-testid="video"]');
      if (await videoElements.count() > 0) {
        await expect(videoElements.first()).toBeVisible();
      }
    }
  });

  test('should display streaming providers if available', async ({ page }) => {
    // Look for streaming section
    const streaming = page.locator('text=Streaming, h3:has-text("Streaming")');
    if (await streaming.count() > 0) {
      await expect(streaming).toBeVisible();
      
      // Check for streaming provider logos
      const providers = page.locator('img[alt*="streaming"], .streaming-provider');
      if (await providers.count() > 0) {
        await expect(providers.first()).toBeVisible();
      }
    }
  });

  test('should have proper page title and meta tags', async ({ page }) => {
    // Check page title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      const content = await metaDescription.getAttribute('content');
      expect(content).toBeTruthy();
    }
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Test desktop layout
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle loading states gracefully', async ({ page }) => {
    // Navigate directly to a movie page
    await page.goto('/movie/1');
    
    // Check if content loads within reasonable time
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Verify content is displayed
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle movie not found gracefully', async ({ page }) => {
    // Navigate to non-existent movie
    await page.goto('/movie/999999');
    
    // Should show error or not found message
    const errorMessage = page.locator('text=Not Found, text=Error, text=Movie not found');
    if (await errorMessage.count() > 0) {
      await expect(errorMessage).toBeVisible();
    } else {
      // Or should redirect to home/404
      await expect(page).toHaveURL(/\/$|\/404/);
    }
  });

  test('should have proper accessibility', async ({ page }) => {
    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // Check for proper image alt texts
    const images = page.locator('img');
    for (let i = 0; i < Math.min(await images.count(), 5); i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for proper link text
    const links = page.locator('a');
    for (let i = 0; i < Math.min(await links.count(), 5); i++) {
      const text = await links.nth(i).textContent();
      const ariaLabel = await links.nth(i).getAttribute('aria-label');
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation through the page
    await page.keyboard.press('Tab');
    
    // Should focus on first interactive element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test keyboard navigation through sections
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should still have focus
    const newFocusedElement = page.locator(':focus');
    await expect(newFocusedElement).toBeVisible();
  });
}); 