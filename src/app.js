const path = require('path');//this is a core module, what means that it's build in node js so we don't need to import it

const express = require('express');//this is npm module which means we need to import it through console
const hbs = require('hbs');

//geocode and forecast functions
const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');

const app = express();//express is a function which return object and by this we can manipulate our document
const port = process.env.PORT || 3000;

//Define paths for Express config
const publickDirectory = path.join(__dirname, '../public/');//by this line we edit __dirname path by going out of src folder and go up to the public    PS: to undrestand what we do just console.log(__dirname);
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//SETUP HANDLEBARS ENGINE AND VIEWS LOCATION
//we need this in purpose to can use dynamic content
app.set('view engine', 'hbs');//as I understood by this line of code we add permision for "hbs" module to view our engine 
app.set('views',viewsPath);//express by default looking for handlebars in views folder, but we wanna change/customize it, so we create a viewsPath and set it through set() method

hbs.registerPartials(partialsPath);//we will use partials as elements of the page that is not change through other pages, and by that I mean header,footer,sidebar and so on

//SETUP STATIC DIRECTORY TO SERVE
//app.use() method use for styling our page I guess
//also it means that this file will represent root path
app.use(express.static(publickDirectory));//express.static() method add as I understood some html by taking as an argument path to the file. But also static means that it cannot change so event if we refresh the browser a couple of times the result will not change

app.get('', (req, res) => {//for home page
	res.render('index',{//an object provide all arguments that we want our template has
		title:'Weather App',
		name:'Andrew Mead'
	});//we don't need to provide an extenstion because we need that the name matches so our index.hbs name shoud match the name in the render
});

app.get('/about', (req,res) => {
	res.render('about', {
		title: 'About me',
		name: 'Andrew Mead'
	});
});

app.get('/help', (req,res) => {
	res.render('help', {
		message: 'User interface instruction!',
		title:'Help',
		name:'Andrew Mead'
	});
});

//THE ISSUE IS WEBSITE WEATHERSTACK DOESN'T WORK PROPERLY SO WE CANNOT GET DATA FROM THERE
app.get('/weather', (req,res) => {
	if(!req.query.address){
		return res.send({
			error:'You must provide an adress!'
		});
	}

	geocode(req.query.address, (error, data) => {
		if(error){
			return res.send({
				error: error
			});
		}

		const {lat,long,location} = data;
		forecast(lat, long, (error, forecastData) => {
			if(error){
				return res.send({
					error//using shorthand syntax when key and value has the same name
				});
			}	

			res.send({
				forecast:forecastData,
				location:location,
				address:req.query.address
			});
		});
	});
});

app.get('/products', (req,res) => {
	if(!req.query.search){//when user didn't provide any search term
		return res.send({
			error:'You must provide a search term'
		});
	}

	//console.log(req.query);//its an query string which means we get the arguments from query string, in our case from this link: http://localhost:3000/products?search=games&rating=5 we will get an object with this information: {search:'games', rating:'5'}
	res.send({
		products:[]
	});
});

app.get('/help/*', (req,res) => {
	res.render('error', {
		message: 'Help article not found'
	});
});

//THIS IS OUR ERROR HANDLER AND IT SHOULD BE THE LAST ONE, BECAUSE WE MATCHING ALL OTHER LINKS THAT WE DIDN'T HANDLE
app.get('*', (req,res) => {
	res.render('error', {
		message:'Page not found'
	});
});




//start server app
app.listen(port, () => {
	console.log('Server is up on port ' + port + '.');//this will not display to user, its just usefull peace of information
});


















