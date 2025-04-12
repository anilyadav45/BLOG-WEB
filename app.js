const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

let port = 3050;

// session for after login 
const session = require('express-session');

app.use(session({
    secret: 'anil4577',  // Replace with a strong secret
    resave: false,
    saveUninitialized: false
}));


// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/blogUsers')
    .then(() => console.log('MongoDB connected users'))
    .catch((err) => console.error('MongoDB connection error:', err));

// User schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    password: String
});

// Blog post schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    date: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const Blog = mongoose.model("Blog", postSchema);

// -------------------------------------------------------------------
// ✅ ROUTES for Blog
// -------------------------------------------------------------------

// Homepage - Show all blog posts
app.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.render("signin.ejs"); // 🟠 Not logged in → show login form
    }

    try {
        const blogs = await Blog.find().sort({ date: -1 }); // 🟢 Logged in → show blogs
        res.render("index.ejs", {
            blogs: blogs,
            user: req.session.user  // Must be set during login
        });
    } catch (err) {
        console.error("Error fetching blogs:", err);
        res.send("Error fetching blog posts");
    }
});


// New blog form
app.get('/blogs/new', (req, res) => {
    res.render("new.ejs");
});

// Create blog
app.post('/blogs', (req, res) => {
    const newBlog = new Blog({
        title: req.body.title,
        content: req.body.content,
        author: "Anonymous",
        date: new Date()
    });

    newBlog.save()
        .then(() => res.redirect('/'))
        .catch((err) => {
            console.error("Error saving blog:", err);
            res.send("Failed to create blog post");
        });
});

// Show single blog post
app.get('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            res.render("show.ejs", { blog });
        } else {
            res.status(404).send("Blog not found");
        }
    } catch (err) {
        console.error("Error fetching blog:", err);
        res.status(500).send("Internal server error");
    }
});

// Edit form for a blog
app.get('/blogs/:id/edit', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            res.render("edit.ejs", { blog });
        } else {
            res.status(404).send("Blog not found");
        }
    } catch (err) {
        console.error("Error fetching blog for edit:", err);
        res.status(500).send("Internal server error");
    }
});

// Update a blog post
app.put('/blogs/:id', async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                content: req.body.content
            },
            { new: true }
        );

        if (updatedBlog) {
            res.redirect(`/blogs/${updatedBlog._id}`);
        } else {
            res.status(404).send("Blog not found");
        }
    } catch (err) {
        console.error("Error updating blog:", err);
        res.status(500).send("Failed to update blog");
    }
});

// Delete blog
app.delete('/blogs/:id', async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (deletedBlog) {
            res.redirect('/');
        } else {
            res.status(404).send("Blog not found");
        }
    } catch (err) {
        console.error("Error deleting blog:", err);
        res.status(500).send("Failed to delete blog");
    }
});

// -------------------------------------------------------------------
// ✅ LOGIN + REGISTER (your original logic preserved)
// -------------------------------------------------------------------

// Show login form
app.get("/login", (req, res) => {
    res.render("signin.ejs");
});

// Handle login
app.post("/login", (req, res) => {
    User.findOne({ email: req.body.email, password: req.body.password })
    .then(user => {
        if (user) {
            console.log("Login success:", user.email);
            req.session.user = user;  // ✅ Store user in session
            res.redirect("/");
        } else {
            console.log("Login failed");
            res.send("Login failed: unmatched credentials!");
        }
    })

});

// Show registration form
app.get("/register", (req, res) => {
    res.render("register.ejs");
});

// Handle registration
app.post("/register", (req, res) => {
    const regInfo = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    };

    const newUser = new User(regInfo);
    newUser.save()
        .then(() => {
            console.log("User registered:", regInfo);
            res.redirect("/");
        })
        .catch((err) => {
            console.error("Registration error:", err);
            res.send("Error during registration. Possibly duplicate email or username.");
        });
});
//LOGOUT SESSION ---------------------------------------------

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.log("Logout error:", err);
        res.redirect('/');
    });
});
//-------------------------



// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`App is listening on http://0.0.0.0:${port}`);
});
