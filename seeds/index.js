const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Reviews = require('../models/review');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => { console.log('DB connected') });

//将【随机读取数组中的元素】包装成匿名函数
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    await Reviews.deleteMany({});
    for (let i = 0; i < 30; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            // author: '61e00c33b549d9b2cfc3fedd',
            author: `${ sample(['61e242da6446da787babe2d1', '61e00c33b549d9b2cfc3fedd'])}`,
            title: `${ sample(descriptors) } ${ sample(places) }`,
            location: `${ cities[random1000].city }, ${ cities[random1000].state }`,
            description: 'Pin a footer to the bottom of the viewport in desktop browsers with this custom HTML and CSS.',
            price: 0,
            geometry: {
              type: 'Point', 
              coordinates: [ -73.9866, 40.7306 ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/daxhp4sga/image/upload/v1669559477/YelpCamp/nrjyqw2tedg0xvurzr00.jpg',
                  filename: 'YelpCamp/vkbefqz4nwpvdabizmx4',
                },
                {
                //   url: 'https://source.unsplash.com/collection/483251',
                  url: 'https://res.cloudinary.com/daxhp4sga/image/upload/v1669559475/YelpCamp/vkbefqz4nwpvdabizmx4.jpg',
                  filename: 'YelpCamp/nrjyqw2tedg0xvurzr00',
                }
              ]
        })
        camp.save();
        
    }
}

seedDB();