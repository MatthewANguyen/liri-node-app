var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var keys = require("./keys.js");

var client = new Twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
})

var spotify = new Spotify({
	id: keys.spotifyKeys.client_id,
	secret: keys.spotifyKeys.client_secret
})

switch(process.argv[2]) {
	case "my-tweets":
		myTweets();
	break;

	case "spotify-this-song":
		spotifyThisSong(process.argv[3]);
	break;

	case "movie-this":
		var movieName = "";

		for(var i = 3; i < process.argv.length; i++) {
			movieName += process.argv[i] + " ";
		}
		if(movieName == "") {
			movieName = "mr.nobody";
		}
			movieThis(movieName);
	break;

	case "do-what-it-says":
		fs.readFile("random.txt", "utf8", function(err, data) {
			var textArray = data.split(",");

			switch(textArray[0]) {
				case "my-tweets":
					myTweets();
				break;

				case "spotify-this-song":
					spotifyThisSong(textArray[1]);
				break;

				case "movie-this":
					movieThis(textArray[1]);
				break;
			}

			for(var i = 0; i < textArray.length; i++) {
				console.log(textArray[i].trim());
			}
			if(err) {
				return console.log(err)
			}
		})
	break;
}

function myTweets() {
	client.get('statuses/user_timeline', {screen_name: 'TongsMashups'}, function(error, tweets, response) {
		var recentLimit = 20;
		for(var i = 0; i < recentLimit; i++) {
			if(tweets[i] != null) {
			    console.log(tweets[i].text);
			}
		}
	});
}

function spotifyThisSong(song) {
	spotify.search({ type: 'track', query: song, limit: 1 })
			.then(function(response) {
				console.log(response.tracks.items[0].artists[0].name);
				console.log(response.tracks.items[0].name);
				console.log(response.tracks.items[0].preview_url);
				console.log(response.tracks.items[0].album.name);
			});
}

function movieThis(name) {
	var queryUrl = "http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=40e9cece";
	request(queryUrl, function (error, response, body) {
	  if(!error && response.statusCode == 200) {
	  	var movies = JSON.parse(body);
	  	console.log(movies.Title);
	  	console.log(movies.Year);
	  	console.log(movies.Ratings[0].Source, movies.Ratings[0].Value);
	  	console.log(movies.Ratings[1].Source, movies.Ratings[1].Value);
	  	console.log(movies.Country);
	  	console.log(movies.Language);
	  	console.log(movies.Plot);
	  	console.log(movies.Actors);
	  }
	});
}