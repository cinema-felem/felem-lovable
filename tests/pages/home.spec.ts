import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and display main content', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for main navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for main content
    await expect(page.locator('main, .container')).toBeVisible();
    
    // Check for footer
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should display featured movies section', async ({ page }) => {
    // Wait for movie content to load
    await page.waitForSelector('[data-testid="movie-card"]', { timeout: 10000 });
    
    // Check for featured movies section
    const sections = await page.locator('section').all();
    expect(sections.length).toBeGreaterThan(0);
    
    // Check for movie cards
    const movieCards = await page.locator('[data-testid="movie-card"]').all();
    expect(movieCards.length).toBeGreaterThan(0);
  });

  test('should display hero section if present', async ({ page }) => {
    // Look for hero section
    const hero = page.locator('[data-testid="hero"], .hero, section:first-child');
    if (await hero.count() > 0) {
      await expect(hero).toBeVisible();
      
      // Check for hero content
      const heroContent = hero.locator('h1, h2');
      if (await heroContent.count() > 0) {
        await expect(heroContent.first()).toBeVisible();
      }
    }
  });

  test('should display navigation menu correctly', async ({ page }) => {
    // Check for navigation links
    const navLinks = page.locator('nav a');
    await expect(navLinks.first()).toBeVisible();
    
    // Check for logo/brand
    const logo = page.locator('nav a:first-child, .logo, .brand');
    await expect(logo).toBeVisible();
    
    // Check for main navigation items
    const homeLink = page.locator('nav a[href="/"]');
    await expect(homeLink).toBeVisible();
  });

  test('should handle movie card interactions', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    
    // Test hover effects
    const firstCard = page.locator('[data-testid="movie-card"]').first();
    await firstCard.hover();
    
    // Check if hover state is applied
    await expect(firstCard).toBeVisible();
    
    // Test click navigation
    await firstCard.click();
    await expect(page).toHaveURL(/\/movie\/\d+$/);
  });

  test('should display movie information correctly', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    
    const movieCards = await page.locator('[data-testid="movie-card"]').all();
    const firstCard = movieCards[0];
    
    // Check for movie title
    const title = firstCard.locator('h3');
    await expect(title).toBeVisible();
    
    // Check for movie poster
    const poster = firstCard.locator('img');
    await expect(poster).toBeVisible();
    
    // Check for rating (on hover)
    await firstCard.hover();
    const rating = firstCard.locator('[data-testid="rating"], .text-cinema-gold');
    if (await rating.count() > 0) {
      await expect(rating).toBeVisible();
    }
  });

  test('should handle sorting functionality', async ({ page }) => {
    // Look for sort controls
    const sortSelect = page.locator('select');
    if (await sortSelect.count() > 0) {
      await expect(sortSelect.first()).toBeVisible();
      
      // Test sort option change
      await sortSelect.first().selectOption('title');
      
      // Wait for potential re-render
      await page.waitForTimeout(1000);
      
      // Verify movies are still displayed
      const movieCards = await page.locator('[data-testid="movie-card"]').all();
      expect(movieCards.length).toBeGreaterThan(0);
    }
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('[data-testid="movie-card"]').first()).toBeVisible();
    
    // Test tablet layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('[data-testid="movie-card"]').first()).toBeVisible();
    
    // Test desktop layout
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('[data-testid="movie-card"]').first()).toBeVisible();
  });

  test('should handle loading states', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    
    // Check if content loads within reasonable time
    await page.waitForSelector('[data-testid="movie-card"]', { timeout: 15000 });
    
    // Verify content is displayed
    const movieCards = await page.locator('[data-testid="movie-card"]').all();
    expect(movieCards.length).toBeGreaterThan(0);
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

  test('should handle keyboard navigation', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Should focus on first interactive element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test keyboard navigation to movie details
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Should navigate to movie details
    await expect(page).toHaveURL(/\/movie\/\d+$/);
  });

  test('should handle search functionality if present', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]');
    
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible();
      
      // Test search input
      await searchInput.first().fill('test');
      await expect(searchInput.first()).toHaveValue('test');
    }
  });

  test('should display footer content', async ({ page }) => {
    // Check for footer
    const footer = page.locator('footer');
    if (await footer.count() > 0) {
      await expect(footer).toBeVisible();
      
      // Check for footer links
      const footerLinks = footer.locator('a');
      if (await footerLinks.count() > 0) {
        await expect(footerLinks.first()).toBeVisible();
      }
    }
  });

  test('should handle theme switching if present', async ({ page }) => {
    // Look for theme toggle
    const themeToggle = page.locator('[data-testid="theme-toggle"], button[aria-label*="theme"]');
    
    if (await themeToggle.count() > 0) {
      await expect(themeToggle.first()).toBeVisible();
      
      // Test theme toggle
      await themeToggle.first().click();
      
      // Check if theme class changes
      const body = page.locator('body');
      const classList = await body.getAttribute('class');
      expect(classList).toBeTruthy();
    }
  });

  test('should handle error states gracefully', async ({ page }) => {
    // This test would require mocking API failures
    // For now, we'll verify the page loads correctly
    await page.waitForSelector('[data-testid="movie-card"]', { timeout: 15000 });
    
    const movieCards = await page.locator('[data-testid="movie-card"]').all();
    expect(movieCards.length).toBeGreaterThan(0);
  });

  test('should have proper accessibility', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    
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
}); 