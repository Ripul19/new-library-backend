const express = require("express");

//env
require('dotenv').config();

const app = express();
//cors
const cors = require("cors");
app.use(cors());

//bodyparser
app.use(express.json());

const models = require("../models/modelIndex");
const routes = require("../routes/routes");

//db
models.sequelize
// .sync({force: true})
// .sync({ alter: true })
.sync()
.then(result => {
    console.log("Database connected");
})
.catch(err => {
    console.log(err);
});

//routes- all, health, error
app.use("/api", routes);
app.get("/health", (req, res) => {
    res.send("Server is healthy");
});
app.use('/', (req, res) => {
    res.status(404).send('Hello World');
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// server
const PORT =  process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is up and running at ${PORT}`));