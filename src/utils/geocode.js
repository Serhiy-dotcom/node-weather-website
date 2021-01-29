const request = require('request');

const geocode = (address,callback) => {
	const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1Ijoic2VyaGl5MjAwMCIsImEiOiJja2tlaGVyeDUwbGNxMnBueWd4Y3E1Y29hIn0.SuKIQRUo0CRJudnUOrYOjA&limit=1';//encodeURIComponent() method transform special characters such as: '?' and so on into some other symbols for safety url

	request( { url, json: true }, (error,response) => {
		const {features} = response.body;

		if(error){
			callback('Unable to connect to location services!', undefined);//undefined because we have an error so we will note need data in this case
		}else if(features.length === 0){
			callback('Unable to find location. Try another request', undefined);
		}else{
			const {center,place_name} = features[0];
			
			callback(undefined, {
				latitude: center[1],
				longitude: center[0],
				location: place_name
			});
		}
	} );
};


module.exports = geocode;

