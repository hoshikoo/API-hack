$(document).ready(function(){

	var getResult = function(artistNameTag){

			$.getJSON("http://developer.echonest.com/api/v4/artist/search?api_key=HDRBCYY9TLSIFUMSR&format=json&name="+artistNameTag+"&results=1", function(data) { 
			var responseData = data.response
			$(".artist-name").text(responseData["artists"][0]["name"]);
			});


			$.getJSON("http://developer.echonest.com/api/v4/artist/biographies?api_key=HDRBCYY9TLSIFUMSR&name="+artistNameTag+"&format=json&results=1&start=0&license=cc-by-sa", function(data) { 
			var responseData = data.response
			$(".bio").text("Bio: " + responseData["biographies"][0]["text"]);
			});

			$.getJSON("http://developer.echonest.com/api/v4/artist/images?api_key=HDRBCYY9TLSIFUMSR&name="+artistNameTag+"&format=json&results=5&start=0&license=unknown", function(data) { 
				var responseData = data.response
				$(".pics").attr("src", responseData["images"][0]["url"]); 
				$(".pics").click(function(){
					if(this.src == responseData["images"][0]["url"]){
				        this.src = responseData["images"][1]["url"];
				    } else if(this.src == responseData["images"][1]["url"]){
				    	 this.src = responseData["images"][2]["url"];
				    }else if(this.src == responseData["images"][2]["url"]){
				    	 this.src = responseData["images"][3]["url"];
				    }else if(this.src == responseData["images"][3]["url"]){
				    	 this.src = responseData["images"][4]["url"];
				    }else {
				        this.src = responseData["images"][0]["url"];
				    }				
				});

				// $('.pictures').find('img').each(function(){
				//   var imgClass = (this.width/this.height > 1) ? 'wide' : 'tall';
				//   $(this).addClass(imgClass);
				//  });

				var artistpic = $('.pics').height();
			    if (artistpic < 250) {
			        var margintop = (250 - artistpic) / 2;
			        $('.pics').css('margin-top', margintop);
			    }
			});


			$.getJSON("http://developer.echonest.com/api/v4/artist/terms?api_key=HDRBCYY9TLSIFUMSR&name="+artistNameTag+"&format=json", function(data) { 
			var responseData = data.response
			$(".genre").text("Genre: " + responseData["terms"][0]["name"] + ", "+ responseData["terms"][1]["name"]+ ", "+ responseData["terms"][2]["name"] ); 
			});

			$.getJSON("http://developer.echonest.com/api/v4/artist/songs?api_key=HDRBCYY9TLSIFUMSR&name="+artistNameTag+"&format=json&start=0&results=2", function(data) { 
			var responseData = data.response
			console.log(responseData["songs"][0]["title"]); 
			});

			$.getJSON("http://developer.echonest.com/api/v4/artist/news?api_key=HDRBCYY9TLSIFUMSR&name="+artistNameTag+"&format=json&results=1&start=0", function(data) { 
			var responseData = data.response
			$(".title").text("Related News: "+responseData["news"][0]["name"]); 
			$(".url").text("Link: "+responseData["news"][0]["url"]); 
			$(".summary").html("Summsry: "+ responseData["news"][0]["summary"]); 
			});

			$.getJSON("http://developer.echonest.com/api/v4/artist/urls?api_key=HDRBCYY9TLSIFUMSR&name="+artistNameTag+"&format=json", function(data) { 
			var responseData = data.response
			$(".officialsite").text(responseData["urls"]["official_url"]); 
			$(".officialsite a").attr("href", responseData["urls"]["official_url"]); 
			});

			$.getJSON("http://developer.echonest.com/api/v4/artist/similar?api_key=HDRBCYY9TLSIFUMSR&name="+artistNameTag+"&format=json&results=5&start=0", function(data) { 
			var responseData = data.response
			$(".simiName").text(responseData["artists"][0]["name"]); 
				var similarid = responseData["artists"][0]["id"];
				$.getJSON("http://developer.echonest.com/api/v4/artist/images?api_key=HDRBCYY9TLSIFUMSR&id="+similarid+"&format=json&results=1&start=0&license=unknown", function(data) { 
						var responseData = data.response
						$(".simipics").attr("src", responseData["images"][0]["url"]); 
					});
				$(".simipics").click(function(){
					//do the search of the similar artist
					var artistName =responseData["artists"][0]["name"];
					$(".artist-name").html('');
					event.preventDefault();
					var artistNameTag = artistName.toLowerCase().split(' ').join('+');
					getResult(artistNameTag);
				});
			});
		};

var artistNameTag = "jimi+henrdix";	
alert(artistNameTag);
getResult(artistNameTag);
	

	$('.artistSubmit').submit( function(event){
		// get the value of the tags the user submitted
		var artistName = $(this).find("input[name='artistName']").val();
		// getUnanswered(tags);
		$(".artist-name").html('');
		// artistName = artistName.toTitleCase();
		// $(".artist-name").text(artistName);
		event.preventDefault();

		var artistNameTag = artistName.toLowerCase().split(' ').join('+');

		alert(artistNameTag);
		getResult(artistNameTag);
	});


});

		
// 		$('.artistSubmit').submit( function(event){
// 		// zero out results if previous search has run
// 		$('.results').html('');
// 		// get the value of the tags the user submitted
// 		var artistName = $(this).find("input[name='artistName']").val();
// 		getTopAnsweres(artistName);
// 	    // $('.results').each(function(){ $(this).append($(this).index()) });
// 	});
	
// });

// var result = $.ajax({
// 		url: "http://developer.echonest.com/api/v4/artist/similar?api_key=HDRBCYY9TLSIFUMSR&"+artistName,
// 		data: request,
// 		dataType: "jsonp",
// 		type: "GET",
// 		})
