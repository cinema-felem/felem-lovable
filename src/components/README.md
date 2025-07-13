# Component Architecture

This document outlines the refactored component architecture for the Felem movie application.

## Component Structure

### UI Components (`src/components/ui/`)
Reusable UI components built on top of shadcn/ui with consistent styling and behavior.

#### Layout Components
- **Container**: Responsive container with configurable max-widths
- **PageHeader**: Consistent page headers with title, subtitle, and action buttons

#### Movie Components
- **MovieCard**: Reusable movie card with hover effects and analytics tracking
- **MovieGrid**: Grid layout for displaying movies with sorting and loading states

#### Data Display Components
- **InfoBadge**: Badge component for displaying information with optional icons
- **RatingDisplay**: Consistent rating display with star icons

#### Feedback Components
- **LoadingSpinner**: Loading spinner with configurable sizes and text
- **ErrorBoundary**: Error boundary with retry functionality and development error details

### Layout Components (`src/components/layout/`)
Layout-specific components for page structure.

### Movie Components (`src/components/movie/`)
Movie-specific components for detailed movie information display.

### Admin Components (`src/components/admin/`)
Administrative interface components.

### Stats Components (`src/components/stats/`)
Statistics and analytics display components.

## Key Improvements

### 1. **Separation of Concerns**
- UI components are now pure and reusable
- Business logic is separated into custom hooks
- Analytics tracking is centralized

### 2. **Type Safety**
- Strong TypeScript interfaces for all components
- Consistent prop interfaces across similar components
- Better error handling with proper types

### 3. **Performance Optimizations**
- Memoized sorting and filtering operations
- Lazy loading for images
- Efficient re-rendering with proper dependency arrays

### 4. **Accessibility**
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly markup

### 5. **Consistency**
- Unified styling approach with Tailwind CSS
- Consistent component APIs
- Standardized error handling

## Usage Examples

### MovieCard
```tsx
import { MovieCard } from '@/components/ui';

<MovieCard 
  movie={movieData}
  onClick={(movie) => console.log('Clicked:', movie)}
  showRating={true}
  showYear={true}
/>
```

### MovieGrid
```tsx
import { MovieGrid } from '@/components/ui';

<MovieGrid 
  title="Popular Movies"
  movies={movies}
  sortOption="rating"
  onSortChange={handleSortChange}
  isLoading={loading}
  hasMore={hasMore}
  onLoadMore={loadMore}
/>
```

### Custom Hook
```tsx
import { useMovies } from '@/hooks/use-movies';

const { 
  movies, 
  sortedMovies, 
  sortOption, 
  setSortOption,
  isLoading 
} = useMovies({ 
  initialSort: 'rating',
  initialMovies: []
});
```

## Migration Guide

### From Old Components
1. Replace direct `MovieCard` usage with the new UI component
2. Update `MovieGrid` to use the new interface
3. Use the `useMovies` hook for movie data management
4. Replace manual loading states with the new `LoadingSpinner`

### Benefits
- **Reduced Code Duplication**: Common patterns are now reusable
- **Better Maintainability**: Changes to UI patterns only need to be made in one place
- **Improved Performance**: Optimized rendering and data handling
- **Enhanced Developer Experience**: Better TypeScript support and consistent APIs 