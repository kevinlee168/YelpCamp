const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Reviews = require('../models/review');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => { console.log('DB connected') });

//将【随机读取数组中的元素】包装成匿名函数
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  await Reviews.deleteMany({});
  for (let i = 0; i < 30; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      // author: '61e00c33b549d9b2cfc3fedd',
      author: `${sample(['658d15a718b48425a66ecca6'])}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      description: 'Pin a footer to the bottom of the viewport in desktop browsers with this custom HTML and CSS.',
      price: 0,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ]
      },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1528892677828-8862216f3665?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          filename: 'YelpCamp/vkbefqz4nwpvdabizmx4',
        },
        {
          //   url: 'https://source.unsplash.com/collection/483251',
          url: 'https://images.unsplash.com/photo-1525811902-f2342640856e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
          filename: 'YelpCamp/nrjyqw2tedg0xvurzr00',
        }
      ]
    })
    camp.save();

  }
}

seedDB();