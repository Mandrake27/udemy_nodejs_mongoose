const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const User = require('./models/user');

const errorController = require('./controllers/error');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, _, next) => {
    try {
        req.user = await User.findById('621635b937a2441fcf13485b');
        next();
    } catch (err) {
        console.log(err);
    }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://mandrake:mandrake37@mongouniversitytasks.o1uvl.mongodb.net/shop?authSource=admin&replicaSet=MongoUniversityTasks-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true')
    .then(async () => {
        const user = await User.findOne();
        if (!user) {
            const newUser = new User({
                name: 'Mandrake',
                email: 'test@test.com',
                cart: {
                    items: [],
                },
            });
            newUser.save();
        }
        console.log('Connected!');
        app.listen(3000)
    })
    .catch(err => console.log(err));