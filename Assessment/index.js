const express = require ('express');
const axios = require ('axios');
const app = express();

app.get('/todos', async (req,res) => {
  const limit = (req.query.limit) || 20;
  const skip = (req.query.skip) || 0;

  try {
    const response = await axios.get(`https://dummyjson.com/todos?limit=${limit}&skip=${skip}`);
    const todos = response.data.todos;

    const totalTodos = skip+todos.length;
    const loadMoreTodos = totalTodos < 100;

    res.status(200).json({todos, totalTodos, loadMoreTodos});

  }catch(e){
    res.status(500).json({error: 'failed to fetch'});
  }
})

app.listen(3000 , () => console.log('server up'));
