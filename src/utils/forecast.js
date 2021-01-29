const request = require('request');


//we can customize our answer from this url, but to understand this and know more you need to read documentation here: https://weatherstack.com/documentation
//const url = 'http://api.weatherstack.com/current?access_key=2c2cda2849e21a5ba6f435ee026ccd34&query=37.8267,-122.4233&units=f';//we add this at the end in purpose that our temperature shows in farengeit we took this from documentation

const forecast = (lat, long, callback) => {
	const url = `http://api.weatherstack.com/current?access_key=2c2cda2849e21a5ba6f435ee026ccd34&query=${lat},${long}&units=f`;

	//if json value set to true it means we dont need to JSON.parse() our data because they will be converted into an object by themselves
	request({ url, json:true }, (error,response) => {
		const {error:responseError, current} = response.body;

		if(error){
			callback('Unable to connect to weather service', undefined);
		}else if(response.body.error){
			callback('Unable to find location', undefined);
		}
		else{
			callback(undefined, `${current.weather_descriptions[0]} It is currently ${current.temperature} degrees out. And it feels like ${current.feelslike} degrees out there. And the humidity is ${current.humidity} out there.`);
		}
	});
};


module.exports = forecast;

