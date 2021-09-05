const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require("body-parser");
//const serviceAccount = require('./randomapp-325107-a86731b2df17.json');
let ejs = require('ejs');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//admin.initializeApp({
//    credential: admin.credential.cert(serviceAccount)
//});

admin.initializeApp();

const db = admin.firestore();

let result = [];

function update() {
    db.collection('todos').get().then((snapshot) => {
        result = [];
        snapshot.forEach((doc) => {
            result.push({ id: doc.id, name: doc.data().name, done: doc.data().done })
        });
    });
}

update();

app.get('/', async (req, res) => {
    let html = await ejs.renderFile('./todos.ejs', { todos: result });
    res.send(html);
});

app.get('/update', (req, res) => {
    update();
    res.send(`done`);
});

app.post('/toggle', (req, res) => {
    result = result.map((item) => {
        if (item.id === req.body.id) {
            item.done = !item.done;
        }

        return item;
    });
    res.send(`done`);
});

app.post('/newItem', async (req, res) => {
    await db.collection('todos').add(
        {
            name : req.body.name,
            done : false
        }
    );
    update();
    res.send(`done`);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`webapp: listening on port ${port}`);
});