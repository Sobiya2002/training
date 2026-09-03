/*
/*
One of the fun features of Aquaintly is that users can rate movies they have seen from 1 to 5. We want to use these ratings to make movie recommendations. 
Ratings will be provided in the following format: [Member Name, Movie Name, Rating]

We consider two users to have similar taste in movies if they have both rated the same movie as 4 or 5.

A movie should be recommended to a user if:
- They haven't rated the movie
- A user with similar taste has rated the movie as 4 or 5

Example:

ratings = [
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
]

If we want to recommend a movie to Charlie, we would recommend "Mad Max" because:
- Charlie has not rated "Mad Max"
- Charlie and Bob have similar taste as they both rated "Lost in Translation" 4 or 5
- Bob rated "Mad Max" a 5

Write a function that takes the name of a user and a collection of ratings, and returns a collection of all movie recommendations that can be made for the given user.

All test cases:
recommendations("Charlie", ratings) => ["Mad Max"]
recommendations("Bob", ratings) => ["Inception", "Topsy-Turvy"]
recommendations("Dennis", ratings) => ["Lost In Translation"]
recommendations("Alice", ratings) => []
recommendations("Franz", ratings) => ["Inception", "All About Eve", "Topsy-Turvy"]

Complexity Variable: R = number of ratings
M = number of movies
U = number of users
*/

ratings = [
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
]
function recommendations(user, ratings) {
  const userLiked = new Map();     // user -> Set of liked movies
  const movieLikedBy = new Map(); // movie -> Set of users who liked it
  const userRated = new Map();    // user -> Set of all rated movies

  for (let [u, movie, rating] of ratings) {
    rating = Number(rating);
 
    if (!userRated.has(u)) userRated.set(u, new Set());
    userRated.get(u).add(movie);
    if (rating >= 4) {
      if (!userLiked.has(u)) userLiked.set(u, new Set());
      userLiked.get(u).add(movie);
      if (!movieLikedBy.has(movie)) movieLikedBy.set(movie, new Set());
      movieLikedBy.get(movie).add(u);
    }
  }
  if (!userLiked.has(user)) return [];
  const similarUsers = new Set();
  // Find similar users through common liked movies
  for (const movie of userLiked.get(user)) {
    for (const otherUser of movieLikedBy.get(movie)) {
      if (otherUser !== user) {
        similarUsers.add(otherUser);
      }
    }
  }
  const result = new Set();
  for (const simUser of similarUsers) {
    for (const movie of userLiked.get(simUser) || []) {
      if (!userRated.get(user).has(movie)) {
        result.add(movie);
      }
    }
  }
  return [...result];
}
console.log(recommendations("Charlie", ratings) )
