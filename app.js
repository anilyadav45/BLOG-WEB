const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
let port = 8080;

// In-memory data array
let blogs = [
    { id: 1, title: 'First Blog Post', content: 'This is the content of the first blog post.' },
    { id: 2, title: 'Second Blog Post', content: 'This is the content of the second blog post.' }
];

// Utility function to generate unique IDs for each new blog post
const generateId = () => blogs.length ? Math.max(...blogs.map(blog => blog.id)) + 1 : 1;

// ROUTES

// Home route - Display all blog posts
app.get('/', (req, res) => {
    res.render("index.ejs", { blogs });
});


// New Blog form route
app.get('/blogs/new', (req, res) => {
    res.render("new.ejs");
});

// Create Blog - Add new post to blogs array
app.post('/blogs', (req, res) => {
    const newBlog = {
        id: generateId(),
        title: req.body.title,
        content: req.body.content
    };
    blogs.push(newBlog);
    res.redirect('/');
});

// Show individual blog post
app.get('/blogs/:id', (req, res) => {
    const blog = blogs.find(b => b.id === parseInt(req.params.id));
    if (blog) {
        res.render("show.ejs", { blog });
    } else {
        res.status(404).send('Blog not found');
    }
});

// Edit Blog form route
app.get('/blogs/:id/edit', (req, res) => {
    const blog = blogs.find(b => b.id === parseInt(req.params.id));
    if (blog) {
        res.render("edit.ejs", { blog });
    } else {
        res.status(404).send('Blog not found');
    }
});

// Update Blog - Modify an existing blog post
app.put('/blogs/:id', (req, res) => {
    const blog = blogs.find(b => b.id === parseInt(req.params.id));
    if (blog) {
        blog.title = req.body.title;
        blog.content = req.body.content;
        res.redirect(`/blogs/${blog.id}`);
    } else {
        res.status(404).send('Blog not found');
    }
});

// Delete Blog - Remove a blog post
app.delete('/blogs/:id', (req, res) => {
    blogs = blogs.filter(b => b.id !== parseInt(req.params.id));
    res.redirect('/');
});

// Start server
app.listen(port, () => console.log(`Blog App running on port  : ${port}`));
