const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json())

const editedComments = new Map();

app.get('/api/comments', async(req,res) =>{
    try{
    const {data} = await axios.get(`https:dummyjson.com/posts/1/comments?limit=10`);
    const newComments = ( data.comments || []).map((c) =>{
        const id = Number(c.id);
        const overRide = editedComments.get(id);
        return overRide ? {...c, body: overRide} : c;
    } )

    res.json(newComments);}
    catch(e){
        console.log(e)
        res.status(500).json({Error: 'Failed to fetch data'});
    }

});

app.put('/api/editedComments', async(req,res) =>{
    const id = Number(req.params.id);
    const {body} = (req.body) || {};

    if(id <=0 || !Number.isInteger(id)){
        res.status(500).json({Error:'Invalid ID'});
    }

    if(typeof body  !== 'string' || body.trim() === '' ){
        res.status(500).json({Error: 'Comment is required'});
    }

    const sanitizedComment = body.trim();
    editedComments.set(id,sanitizedComment);
    res.json({success: true, id, body: sanitizedComment})
})

app.listen(3000, () => {'Server is running'});



