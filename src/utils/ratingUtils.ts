
/**
 * Calculates the median value from an array of numbers.
 * If the array is empty, returns the default value.
 */
export function calculateMedianRating(ratings: number[], defaultValue = 5.0): number {
  if (!ratings || ratings.length === 0) {
    return defaultValue;
  }
  
  // Sort ratings in ascending order
  const sortedRatings = [...ratings].sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedRatings.length / 2);
  
  // If there is an odd number of ratings, return the middle one
  // If there is an even number of ratings, return the average of the two middle values
  if (sortedRatings.length % 2 === 1) {
    return sortedRatings[middleIndex];
  } else {
    return (sortedRatings[middleIndex - 1] + sortedRatings[middleIndex]) / 2;
  }
}
