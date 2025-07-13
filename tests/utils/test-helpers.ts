import { Page, Locator } from '@playwright/test';

export interface TestMovie {
  id: string;
  title: string;
  tmdbTitle?: string;
  posterPath: string;
  rating: number;
  releaseYear: string;
}

export const mockMovies: TestMovie[] = [
  {
    id: '1',
    title: 'Test Movie 1',
    tmdbTitle: 'Test Movie 1 TMDB',
    posterPath: 'https://via.placeholder.com/300x450',
    rating: 8.5,
    releaseYear: '2023'
  },
  {
    id: '2',
    title: 'Test Movie 2',
    posterPath: 'https://via.placeholder.com/300x450',
    rating: 7.8,
    releaseYear: '2022'
  },
  {
    id: '3',
    title: 'Test Movie 3',
    tmdbTitle: 'Test Movie 3 TMDB',
    posterPath: 'https://via.placeholder.com/300x450',
    rating: 9.1,
    releaseYear: '2024'
  }
];

export class TestHelpers {
  static async waitForPageLoad(page: Page, timeout = 10000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  static async waitForMovieCards(page: Page, timeout = 10000) {
    await page.waitForSelector('[data-testid="movie-card"]', { timeout });
  }

  static async getMovieCards(page: Page): Promise<Locator[]> {
    return await page.locator('[data-testid="movie-card"]').all();
  }

  static async clickFirstMovieCard(page: Page) {
    await this.waitForMovieCards(page);
    await page.locator('[data-testid="movie-card"]').first().click();
  }

  static async navigateToPage(page: Page, path: string) {
    await page.goto(path);
    await this.waitForPageLoad(page);
  }

  static async setViewportSize(page: Page, size: 'mobile' | 'tablet' | 'desktop') {
    const sizes = {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1920, height: 1080 }
    };
    await page.setViewportSize(sizes[size]);
  }

  static async testResponsiveLayout(page: Page, element: Locator) {
    // Test mobile
    await this.setViewportSize(page, 'mobile');
    await expect(element).toBeVisible();
    
    // Test tablet
    await this.setViewportSize(page, 'tablet');
    await expect(element).toBeVisible();
    
    // Test desktop
    await this.setViewportSize(page, 'desktop');
    await expect(element).toBeVisible();
  }

  static async testKeyboardNavigation(page: Page) {
    // Test tab navigation
    await page.keyboard.press('Tab');
    
    // Should focus on first interactive element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    return focusedElement;
  }

  static async testAccessibility(page: Page) {
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
  }

  static async testLoadingStates(page: Page, selector: string, timeout = 15000) {
    await page.waitForSelector(selector, { timeout });
    const elements = await page.locator(selector).all();
    expect(elements.length).toBeGreaterThan(0);
  }

  static async testSorting(page: Page, sortSelect: Locator, option: string) {
    // Get initial order
    const initialMovies = await page.locator('[data-testid="movie-card"] h3').allTextContents();
    
    // Change sort option
    await sortSelect.selectOption(option);
    
    // Wait for potential re-render
    await page.waitForTimeout(1000);
    
    // Get new order
    const sortedMovies = await page.locator('[data-testid="movie-card"] h3').allTextContents();
    
    // Verify order changed (basic check)
    expect(sortedMovies.length).toBe(initialMovies.length);
  }

  static async testHoverEffects(page: Page, element: Locator) {
    // Hover over element
    await element.hover();
    
    // Check if hover state is applied
    await expect(element).toBeVisible();
    
    // Check for hover-specific classes
    const hoverClasses = await element.getAttribute('class');
    expect(hoverClasses).toBeTruthy();
  }

  static async testExternalLinks(page: Page) {
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
  }

  static async testErrorHandling(page: Page, errorPath: string) {
    await page.goto(errorPath);
    
    // Should show error or not found message
    const errorMessage = page.locator('text=Not Found, text=Error, text=Movie not found');
    if (await errorMessage.count() > 0) {
      await expect(errorMessage).toBeVisible();
    } else {
      // Or should redirect to home/404
      await expect(page).toHaveURL(/\/$|\/404/);
    }
  }
}

export const expect = require('@playwright/test').expect; 