const axios = require('axios');
const apikey = require('./config/key').nutritionix
const query = require('./query')


axios({
    url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
    method: 'post',
    headers: apikey,
    data: {
        "query": query
       },
    json: true 
 }).then(body => {
    console.log(body.data)
 }) 
 .catch(err => {
    console.log(err);
 });