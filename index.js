import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import methodOverride from "method-override";


const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

const posts = [];


app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts });
});

app.get("/edit/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find(post => post.id === id);
  
  if (post) {
    res.render("edit.ejs", { post });
  } else {
    return res.status(404).send("Post not found"); 
  }
});

app.get("/home", (req, res) => {
  res.render("home.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/gallery", (req, res) => {
  res.render("gallery.ejs");
});

app.post("/submit", (req,res) => {
  if (req.body["bTitle"].trim() !== "" && req.body["bMessage"].trim() !== "") {
    const userPost = {
        id: uuidv4(),
        title: req.body["bTitle"],
        message: req.body["bMessage"]
    };
    posts.unshift(userPost);
    res.redirect("/");
  } else {
    console.log("Please fill out all fields");
    res.send(`
      <script>
        alert("Please fill out all fields before submitting!");
        window.location.href = "/";
      </script>
    `);

  }
    
  console.log(userPost);

        
});

app.patch("/update/:id", (req,res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex(post => post.id === id);
  const newTitle = req.body["bTitle"];
  const newMessage = req.body["bMessage"];
  const oldTitle = posts[postIndex].title;
  const oldMessage = posts[postIndex].message;

  if (postIndex !== -1) {
    if (newTitle !== oldTitle || newMessage !== oldMessage) {
      posts[postIndex].title = newTitle;
      posts[postIndex].message = newMessage;
      console.log(`post edited to: ${newMessage}`);
      res.redirect("/");
    } else if (newTitle === oldTitle || newMessage === oldMessage){
      console.log("No changes made");
      res.redirect("/");
    }
    } 
  });
  
//0. extract the id value from the form and store it in the id variable so yoiu casn track each post title and message

//1.extract the title and message values from the form and store them in the title and message variables

//2. check if there has been any change between the new new title and message and the old title and message
//3. if there has been a change, update the title and message of the post with the id value in the posts array


app.delete("/delete/:id", (req, res) => {
  /*to get the delete button to work
  1. create a delete button/form in the index.ejs file
  2. create a delete route in the index.js file
  3. extract the id value from req.params and store it in the id variable
  */

  const { id } = req.params;
  //4. find the index of the post with the id value in the posts array and store in the postIndex variable
  const postIndex = posts.findIndex(post => post.id === id);
  //5. if the postIndex is not -1, remove the post from the posts array using splice
  if (postIndex !== -1) {
    posts.splice(postIndex, 1);
    console.log(req.params.id);
    res.redirect("/");
  } else {
    console.log("Post not found");
    res.redirect("/");
  }
});


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});