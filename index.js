const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const User = require('./models/User');
const Book = require('./models/Book')



const app = express();
app.use(cors())
app.use(express.json());
const PORT = 5000;
mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log('Connected');
}).catch((err)=>{
    console.error('Not connected');
})


app.get('/', async (req, res)=>{
    res.send("Hello world");
})

app.post('/api/users', async (req,res)=>{
    const {name, mobile, email, password, role} = req.body;
    if(!name || !mobile || !email || !password || !role){
        return res.status(400).json({error: 'All Fields are required'});
    }
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({error:'Email already exists'});
        }
        const newUser = new User({name, mobile, email, password, role});
        await newUser.save();
        res.status(201).json({message:"User registered", user:newUser});
    }catch(err){
        res.status(500).json({error:'Registration failed'});
    }
});

app.post('/api/login', async (req, res)=>{
    const {email, password} = req.body;
    try{
    const user = await User.findOne({email, password});
    if(!user){
        return res.status(401).json({error:'Invalid Credentials'});
    }
    res.json({message:'Login successful', user});
}catch(err){
    res.status(500).json({error:'Login failed'});
}
})

app.post('/api/books', async(req, res)=>{
    const {title, author, genre, location, email, ownerId}= req.body;
    try{
        const user = await User.findById(ownerId);
        if(!user || user.role !== 'owner'){
            return res.status(403).json({error:'Only owners can add books'});
        }
        const newBook = new Book({title, author, genre, location, email, ownerId});
        await newBook.save();
        res.status(201).json({ message: 'Book added', book: newBook });
    }catch(err){
        res.status(500).json({error:'Failed to add book'});
    }
})

app.get('/api/books', async(req, res)=>{
    try{
        const books = await Book.find();
        res.json(books);
    }catch(err){
        res.status(500).json({error:'Failed to fetch books'})
    }
})

app.patch('/api/books/:id', async (req, res)=>{
    const {id} = req.params;
    const {status} = req.body;
    try{
        const book = await Book.findById(id);
        if(!book){
            return res.status(404).json({error:'Book not found'});
        }
        book.status = status;
        await book.save();
        res.json({message:'Book status updated', book});
    }catch(err){
        res.status(500).json({error:'Failed to update status'});
    }
});

app.listen(PORT, () =>{
    console.log(`Server running at ${PORT}`);
});