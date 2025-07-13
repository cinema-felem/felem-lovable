# Playwright Integration Tests

This directory contains comprehensive integration tests for the Felem movie application using Playwright.

## Test Structure

```
tests/
├── components/           # Component-specific tests
│   ├── movie-card.spec.ts
│   └── movie-grid.spec.ts
├── pages/               # Page-level tests
│   ├── home.spec.ts
│   └── movie-details.spec.ts
├── navigation/          # Navigation and routing tests
│   └── navigation.spec.ts
├── utils/              # Test utilities and helpers
│   └── test-helpers.ts
└── README.md           # This file
```

## Test Categories

### 1. Component Tests (`components/`)
Tests for individual React components and their interactions:

- **MovieCard**: Tests hover effects, navigation, accessibility, and responsive behavior
- **MovieGrid**: Tests sorting, loading states, grid layout, and pagination

### 2. Page Tests (`pages/`)
End-to-end tests for complete pages:

- **Home Page**: Tests main content, featured movies, navigation, and responsive design
- **Movie Details**: Tests movie information display, external links, videos, and accessibility

### 3. Navigation Tests (`navigation/`)
Tests for routing and navigation flows:

- **Page Navigation**: Tests navigation between pages, URL handling, and browser history
- **Direct URL Access**: Tests direct URL navigation and 404 handling

## Test Features

### ✅ **Comprehensive Coverage**
- **Component Behavior**: Hover effects, click interactions, loading states
- **Navigation**: Page transitions, URL handling, browser back/forward
- **Responsive Design**: Mobile, tablet, and desktop viewport testing
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Error Handling**: 404 pages, loading errors, network failures
- **Performance**: Loading times, rendering performance

### ✅ **Cross-Browser Testing**
Tests run on multiple browsers:
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)
- Mobile browsers (Chrome Mobile, Safari Mobile)

### ✅ **Real-World Scenarios**
- User interactions (clicks, hovers, keyboard navigation)
- Network conditions (slow loading, timeouts)
- Different screen sizes and orientations
- Error states and edge cases

## Running Tests

### Prerequisites
1. Install dependencies: `npm install`
2. Install Playwright browsers: `npx playwright install`

### Test Commands
```bash
# Run all tests
npm run test

# Run tests with UI (interactive mode)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run specific test file
npx playwright test tests/components/movie-card.spec.ts

# Run tests on specific browser
npx playwright test --project=chromium

# Run tests in debug mode
npx playwright test --debug
```

### Test Configuration
The tests are configured in `playwright.config.ts`:
- **Base URL**: `http://localhost:8080`
- **Web Server**: Automatically starts `npm run dev` before tests
- **Timeout**: 10-15 seconds for element waits
- **Retries**: 2 retries on CI, 0 locally
- **Parallel**: Full parallel execution

## Test Data

### Mock Data
Tests use mock movie data defined in `test-helpers.ts`:
```typescript
export const mockMovies: TestMovie[] = [
  {
    id: '1',
    title: 'Test Movie 1',
    tmdbTitle: 'Test Movie 1 TMDB',
    posterPath: 'https://via.placeholder.com/300x450',
    rating: 8.5,
    releaseYear: '2023'
  },
  // ... more movies
];
```

### Test Helpers
Common test utilities in `TestHelpers` class:
- `waitForPageLoad()`: Wait for network idle
- `waitForMovieCards()`: Wait for movie cards to load
- `testResponsiveLayout()`: Test multiple viewport sizes
- `testAccessibility()`: Check accessibility features
- `testKeyboardNavigation()`: Test keyboard interactions

## Test Patterns

### 1. **Page Object Pattern**
Each page has its own test file with focused tests:
```typescript
test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  
  test('should display featured movies', async ({ page }) => {
    // Test implementation
  });
});
```

### 2. **Component Testing**
Component tests focus on specific functionality:
```typescript
test.describe('MovieCard Component', () => {
  test('should show hover effects', async ({ page }) => {
    await page.waitForSelector('[data-testid="movie-card"]');
    const movieCard = page.locator('[data-testid="movie-card"]').first();
    await movieCard.hover();
    await expect(movieCard.locator('.group-hover\\:bg-black\\/40')).toBeVisible();
  });
});
```

### 3. **Responsive Testing**
Tests verify behavior across different screen sizes:
```typescript
test('should be responsive', async ({ page }) => {
  // Test mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(element).toBeVisible();
  
  // Test desktop
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect(element).toBeVisible();
});
```

### 4. **Accessibility Testing**
Tests verify accessibility features:
```typescript
test('should have proper accessibility', async ({ page }) => {
  // Check for ARIA labels
  const ariaLabel = await element.getAttribute('aria-label');
  expect(ariaLabel).toContain('View details for');
  
  // Check for alt text
  const altText = await image.getAttribute('alt');
  expect(altText).toContain('poster');
});
```

## Test Data Attributes

Tests use `data-testid` attributes for reliable element selection:

### Required Data Attributes
Add these to your components for testing:

```tsx
// MovieCard component
<Link 
  to={`/movie/${movie.id}`} 
  data-testid="movie-card"
  aria-label={`View details for ${displayTitle}`}
>
  {/* card content */}
  <span data-testid="rating">{movie.rating}</span>
</Link>

// MovieGrid component
<section data-testid="movie-grid">
  <h2>{title}</h2>
  <div className="grid">
    {/* movie cards */}
  </div>
</section>

// Rating display
<div data-testid="rating" className="rating">
  <Star className="star-icon" />
  <span>{rating}</span>
</div>
```

## Best Practices

### 1. **Reliable Selectors**
- Use `data-testid` for test-specific elements
- Avoid CSS classes that might change
- Use semantic selectors when possible

### 2. **Wait Strategies**
- Use `waitForSelector()` for dynamic content
- Use `waitForLoadState('networkidle')` for page loads
- Set appropriate timeouts for slow operations

### 3. **Test Isolation**
- Each test should be independent
- Use `beforeEach()` for setup
- Clean up state between tests

### 4. **Error Handling**
- Test both success and error scenarios
- Verify error messages and fallback behavior
- Test network failures and timeouts

### 5. **Performance**
- Keep tests fast and focused
- Use parallel execution
- Avoid unnecessary waits

## Continuous Integration

### GitHub Actions
Tests run automatically on:
- Pull requests
- Main branch pushes
- Scheduled runs

### CI Configuration
```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npm run test

- name: Upload test results
  uses: actions/upload-artifact@v2
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Debugging Tests

### 1. **Debug Mode**
```bash
npx playwright test --debug
```

### 2. **Trace Viewer**
```bash
npx playwright show-trace trace.zip
```

### 3. **Screenshots and Videos**
- Screenshots on failure: `screenshot: 'only-on-failure'`
- Videos on failure: `video: 'retain-on-failure'`

### 4. **Console Logs**
```typescript
// Add to tests for debugging
console.log('Debug info:', await element.textContent());
```

## Future Enhancements

### Planned Improvements
1. **API Mocking**: Mock external API calls for consistent testing
2. **Visual Regression**: Add visual regression testing
3. **Performance Testing**: Add performance benchmarks
4. **E2E Flows**: Add complete user journey tests
5. **Mobile Testing**: Enhanced mobile-specific tests

### Test Coverage Goals
- [ ] 100% component coverage
- [ ] 100% page coverage
- [ ] 100% navigation coverage
- [ ] 90%+ accessibility coverage
- [ ] 100% responsive design coverage

## Contributing

### Adding New Tests
1. Follow the existing test structure
2. Use descriptive test names
3. Add appropriate data attributes
4. Include accessibility tests
5. Test responsive behavior
6. Add error handling tests

### Test Naming Convention
```typescript
test('should [expected behavior] when [condition]', async ({ page }) => {
  // Test implementation
});
```

### Documentation
- Update this README when adding new test categories
- Document new test helpers and utilities
- Add examples for complex test scenarios 