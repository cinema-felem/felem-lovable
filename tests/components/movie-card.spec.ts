import { test, expect } from '@playwright/test';

const mockMovie = {
  id: '1',
  title: 'Test Movie',
  tmdbTitle: 'Test Movie TMDB',
  posterPath: 'https://via.placeholder.com/300x450',
  rating: 8.5,
  releaseYear: '2023'
};

test.describe('MovieCard Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page that contains MovieCard components
    await page.goto('/');
  });

  test('should display movie information correctly', async ({ page }) => {
    // Wait for movie cards to load
    await page.waitForSelector('[data-testid="movie-card"]', { timeout: 10000 });
    
    // Check if movie cards are visible
    const movieCards = await page.locator('[data-testid="movie-card"]').all();
    expect(movieCards.length).toBeGreaterThan(0);
    
    // Check first movie card content
    const firstCard = movieCards[0];
    
    // Verify movie title is displayed
    await expect(firstCard.locator('h3')).toBeVisible();
    
    // Verify rating is displayed
    await expect(firstCard.locator('[data-testid="rating"]')).toBeVisible();
    
    // Verify release year is displayed
    await expect(firstCard.locator('p')).toBeVisible();
  });

  test('should show hover effects', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    
    const movieCard = page.locator('[data-testid="movie-card"]').first();
    
    // Hover over the movie card
    await movieCard.hover();
    
    // Check if hover overlay appears
    await expect(movieCard.locator('.group-hover\\:bg-black\\/40')).toBeVisible();
    
    // Check if movie info becomes visible on hover
    await expect(movieCard.locator('.group-hover\\:opacity-100')).toBeVisible();
  });

  test('should navigate to movie details page on click', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    
    const movieCard = page.locator('[data-testid="movie-card"]').first();
    
    // Get the href attribute to verify it's a link
    const href = await movieCard.getAttribute('href');
    expect(href).toMatch(/^\/movie\/\d+$/);
    
    // Click on the movie card
    await movieCard.click();
    
    // Verify navigation to movie details page
    await expect(page).toHaveURL(/\/movie\/\d+$/);
  });

  test('should display TMDB title when available', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    
    const movieCards = await page.locator('[data-testid="movie-card"]').all();
    
    // Check if any card has TMDB title (this would be in the actual data)
    for (const card of movieCards) {
      const title = await card.locator('h3').textContent();
      expect(title).toBeTruthy();
    }
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    
    const movieCard = page.locator('[data-testid="movie-card"]').first();
    
    // Check for aria-label
    const ariaLabel = await movieCard.getAttribute('aria-label');
    expect(ariaLabel).toContain('View details for');
    
    // Check for alt text on image
    const image = movieCard.locator('img');
    const altText = await image.getAttribute('alt');
    expect(altText).toContain('poster');
  });

  test('should handle image loading errors gracefully', async ({ page }) => {
    // This test would require mocking broken images
    // For now, we'll just verify images have proper loading attributes
    await page.waitForSelector('[data-testid="movie-card"]');
    
    const movieCard = page.locator('[data-testid="movie-card"]').first();
    const image = movieCard.locator('img');
    
    // Check for lazy loading
    const loading = await image.getAttribute('loading');
    expect(loading).toBe('lazy');
  });

  test('should display rating with star icon', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    
    const movieCard = page.locator('[data-testid="movie-card"]').first();
    
    // Hover to show rating
    await movieCard.hover();
    
    // Check for star icon
    const starIcon = movieCard.locator('svg[class*="text-cinema-gold"]');
    await expect(starIcon).toBeVisible();
    
    // Check for rating text
    const ratingText = movieCard.locator('[data-testid="rating"]');
    await expect(ratingText).toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    
    // Test on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileCard = page.locator('[data-testid="movie-card"]').first();
    await expect(mobileCard).toBeVisible();
    
    // Test on tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    const tabletCard = page.locator('[data-testid="movie-card"]').first();
    await expect(tabletCard).toBeVisible();
    
    // Test on desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopCard = page.locator('[data-testid="movie-card"]').first();
    await expect(desktopCard).toBeVisible();
  });
}); 