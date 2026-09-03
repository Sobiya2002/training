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
];

const recommendation = (user, ratings) => {
    const userRated = new Map();
    const userLiked = new Map();
    const movieLiked = new Map();

    for (let [u, movie, rating] of ratings) {
        rating = Number(rating);

        if (!userRated.has(u)) {
            userRated.set(u, new Set());
        }
        userRated.get(u).add(movie);

        if (rating >= 4) {
            if (!userLiked.has(u)) {
                userLiked.set(u, new Set());
            }
            userLiked.get(u).add(movie);

            if (!movieLiked.has(movie)) {
                movieLiked.set(movie, new Set());
            }
            movieLiked.get(movie).add(u);
        }
    }
    // console.log(userRated);
    // console.log(userLiked);
    // console.log(movieLiked);

    if(!userLiked.get(user)){
        return [];
    }

    const similarUser = new Set();

    for(const movie of userLiked.get(user)){
        for(const otherUser of movieLiked.get(movie)){
            if(otherUser !== user){
                similarUser.add(otherUser);
            }
        }
    }
    // console.log(similarUser);

    const result = new Set();

    for(const simUsr of similarUser){
        for(const movie of userLiked.get(simUsr)){
            if(!userRated.get(user).has(movie)){
                result.add(movie);
            }
        }
    }

    return [...result];
}

console.log(recommendation('Charlie', ratings));
console.log(recommendation('Bob', ratings));
console.log(recommendation('Dennis', ratings));
console.log(recommendation('Alice', ratings));
console.log(recommendation('Franz', ratings));
