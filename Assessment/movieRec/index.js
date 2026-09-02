
const recommendations = (target, ratings) => {
  // Maps
  const userToRatings = new Map();       // user -> Map(movie -> rating)
  const userHighMovies = new Map();      // user -> Set(movies rated >= 4)
  const movieToHighRaters = new Map();   // movie -> Set(users who rated >= 4)

  ratings.forEach(([user, movie, ratingRaw]) => {
    const rating = Number(ratingRaw);

    if (!userToRatings.has(user)) userToRatings.set(user, new Map());
    userToRatings.get(user).set(movie, rating);

    if (rating >= 4) {
      if (!userHighMovies.has(user)) userHighMovies.set(user, new Set());
      userHighMovies.get(user).add(movie);

      if (!movieToHighRaters.has(movie)) movieToHighRaters.set(movie, new Set());
      movieToHighRaters.get(movie).add(user);
    }
  });

  const targetRatings = userToRatings.get(target) ?? new Map();
  const targetHighMovies = Array.from(userHighMovies.get(target) ?? []).sort((a, b) => a.localeCompare(b));
 

  // Similar users: share any target high-rated movie (both rated >= 4)
  const similarUsers = [];
  const seenSimilar = new Set();

  targetHighMovies.forEach((movie) => {
    const raters = Array.from(movieToHighRaters.get(movie) ?? []).sort((a, b) => a.localeCompare(b));
 
    raters.forEach((u) => {
      if (u !== target && !seenSimilar.has(u)) {
        seenSimilar.add(u);
        similarUsers.push(u); 
      }
    });
  });

  // Recommendations: high-rated movies from similar users that target hasn't rated
  const recs = [];
  const seenRecs = new Set();

  similarUsers.forEach((u) => {
    const highMovies = Array.from(userHighMovies.get(u) ?? []).sort((a, b) => a.localeCompare(b));
    highMovies.forEach((m) => {
      if (!targetRatings.has(m) && !seenRecs.has(m)) {
        seenRecs.add(m);
        recs.push(m);
      }
    });
  });

  return recs;
};

/* ---------- Example usage & verification ---------- */
const ratings = [
  ["Alice", "Frozen", "5"],
  ["Bob", "Mad Max", "5"],
  ["Charlie", "Lost In Translation", "4"],
  ["Charlie", "Inception", "4"],
  ["Bob", "All About Eve", "3"],
  ["Bob", "Lost In Translation", "5"],
  ["Dennis", "All About Eve", "5"],
  ["Dennis", "Mad Max", "4"],
  ["Charlie", "Topsy-Turvy", "2"],
  ["Dennis", "Topsy-Turvy", "4"],
  ["Alice", "Lost In Translation", "1"],
  ["Franz", "Lost In Translation", "5"],
  ["Franz", "Mad Max", "5"]
];

console.log('Charlie =>', recommendations("Charlie", ratings)); // ["Mad Max"]
console.log('Bob =>', recommendations("Bob", ratings));         // ["Inception", "Topsy-Turvy"]
// console.log('Dennis =>', recommendations("Dennis", ratings));   // ["Lost In Translation"]
// console.log('Alice =>', recommendations("Alice", ratings));     // []
// console.log('Franz =>', recommendations("Franz", ratings));     // ["Inception", "All About Eve", "Topsy-Turvy"]

raters.forEach((u) => {
      if (u !== target && !seenSimilar.has(u)) {
        seenSimilar.add(u);
        similarUsers.push(u); 
