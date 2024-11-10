const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
let port = 8080;

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// In-memory data array
let blogs = [
    { id: 1, title: 'Embracing Incremental Improvement in Code', content: 'When it comes to writing clean and efficient code, the instinct is often to aim for perfection on the first try. However, one approach that has transformed my coding workflow is embracing incremental improvement. Instead of striving for an ideal solution right away, I focus on getting a functional version of the code up and running, then optimize and refine it over time.' },
    { id: 2, title: 'Shifting from Traditional Loops to Recursive Thinking', content: 'In many cases, developers rely heavily on loops to iterate over data structures. However, I’ve been exploring the power of recursion to simplify code and solve problems in new ways. Recursive functions can make code more elegant and readable, especially for problems that involve hierarchical or nested structures' }
];
//for login data
const perInfoArr =  [];
//for register data
const registerInfoArr = [];

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
//creating route for sign in section  
//this section only give data filling section but to take those data post request we have to create
app.get("/login",(req,res)=>{
    res.render("signin.ejs"); //here i am sending empty object in ejs i take some data from input 
})

//to get those data we filled on signin section
app.post("/login",(req,res)=>{
    let perInfo = {
        email: req.body.email,
        password:req.body.password
    };
    perInfoArr.push(perInfo);
    console.log(perInfo);
    res.redirect("/");
})

//creating route to get register section
app.get("/register",(req,res)=>{
    res.render("register.ejs");
}) //this is only for getting the form 
//route to take user data and print
app.post("/register",(req,res)=>{
    let regInfo = {
        name : req.body.name,
        email : req.body.email,
        username : req.body.username,
        password : req.body.password,
        confirmpassword : req.body.confirmPassword
    };
    registerInfoArr.push(regInfo);
    console.log(regInfo);
    res.redirect("/");
})
// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`App is listening on http://0.0.0.0:${port}`);
});
//server in mobile localip:8080 try