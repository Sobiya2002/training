First, I iterate through every grid cell and treat it as a potential starting point.
  Whenever a cell matches the first character of the word, I launch a DFS search.
  During DFS, I verify the current character, store its coordinate in the path, and recursively explore only the allowed directions, right and down. 
  
If the entire word is matched, I return the collected path. Otherwise, I backtrack by removing the current coordinate and continue searching.


  const search = (grid, word) => {
    const rows = grid.length;
    const cols = grid[0].length;
 
    const dfs = (row, col, index, path) => {
 
        // Entire word matched
        if (index === word.length) {
            return true;
        }
 
        // Out of bounds
        if (
            row < 0 ||
            row >= rows ||
            col < 0 ||
            col >= cols
        ) {
            return false;
        }
 
        // Character mismatch
        if (grid[row][col] !== word[index]) {
            return false;
        }
 
        // Add current coordinate
        path.push([row, col]);
 
        // Last character matched
        if (index === word.length - 1) {
            return true;
        }
 
        // Move right
        if (dfs(row, col + 1, index + 1, path)) {
            return true;
        }
 
        // Move down
        if (dfs(row + 1, col, index + 1, path)) {
            return true;
        }
 
        // Backtrack
        path.pop();
 
        return false;
    };
 
    // Try every cell as a starting point
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
 
            if (grid[row][col] === word[0]) {
 
                const path = [];
 
                if (dfs(row, col, 0, path)) {
                    return path;
                }
            }
        }
    }
 
    return [];
};

