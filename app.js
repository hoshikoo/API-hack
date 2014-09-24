$(document).ready(function(){

	$('.artistSubmit').submit( function(event){
		// get the value of the tags the user submitted

		var artistName = $(this).find("input[name='artistName']").val();
		$(".artist-name").html('');
		event.preventDefault();
		var artistNameTag = artistName.toLowerCase().split(' ').join('+');
		getResult(artistNameTag);
		document.getElementById("inputform").value = "";
	});

	getResult("marvin+gaye");

	$(".similarArtistspic").click(function(event){
		//do the search of the similar artist
		event.preventDefault();

		var findArtistName = $(this).find(".simiNames")
		var artistName = $(findArtistName).text();
		alert(artistName + "siminame");
		var artistNameTag = artistName.toLowerCase().split(' ').join('+');
		getResult(artistNameTag);
	});




	$('.simi').flexslider({
    animation: "slide",
    animationLoop: false,
    itemWidth: 150,
    itemMargin: 5
  	});

  	 $('.pictures').flexslider({
    animation: "slide",
    controlNav: "thumbnails",
    itemWidth: 250,
    // itemMargin: 5
  	});



  	$('#audio-player').mediaelementplayer({
            alwaysShowControls: true,
            features: ['playpause','volume','progress'],
            audioVolume: 'horizontal',
            audioWidth: 200,
            audioHeight: 100
    });

 //  $(function(){
 //    $('audio,video').mediaelementplayer({
 //        loop: true,
 //        shuffle: true,
 //        playlist: true,
 //        audioHeight: 30,
 //        playlistposition: 'bottom',
 //        features: ['playlistfeature', 'prevtrack', 'playpause', 'nexttrack', 'loop', 'shuffle', 'playlist', 'current', 'progress', 'duration', 'volume'],
 //    });
	// });
	
	

});


var showError = function(error){
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

var getResult = function(artistNameTag){
	var echonestApi = "http://developer.echonest.com/api/v4/artist/";
	var echonestkey = "?api_key=HDRBCYY9TLSIFUMSR&"

	$.getJSON(echonestApi+"search"+echonestkey+"format=json&name="+artistNameTag+"&results=1").done(function(data) { 
		var responseData = data.response;
		$(".artist-name").text(responseData["artists"][0]["name"]);
	}).fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.artist-name').append(errorElem);
	});

	$.getJSON(echonestApi+"biographies"+echonestkey+"name="+artistNameTag+"&format=json&results=1&start=0&license=cc-by-sa").done(function(data) { 
		var responseData = data.response;
		$(".bio").html('');
		$(".bio").text("Bio: " + responseData["biographies"][0]["text"]);
			var artistName = artistNameTag.replace("+"," ");
		$('.bio').highlight(artistName);	    
	});

	$.getJSON(echonestApi+"images"+echonestkey+"name="+artistNameTag+"&format=json&results=5&start=0&license=unknown").done(function(data) { 
		$(".pics").removeAttr("src");
		var responseData = data.response;
		var picsNumLength = responseData.images.length;
		var picsImg = responseData.images;
		
		for (var i = 0; i<5; i++){

			$( ".pics" ).each(function(i) {		
				if(picsImg[i]=== undefined){
		        	$(this).attr("src", "images/photo_not_available_big.jpg");
		    	}else{
		    		$(this).attr("src", picsImg[i]["url"]);
		    	};		    	
			});
		};

			
			// $('.pics[src=""]').attr("src", "images/photo_not_available_big.jpg").show();
			  			

	
		
			   
		    // }else{

			// 	 $("<li class='slide'/>").each( "<img class='pics' src="+ responseData["images"][i]["url"]+"/>").appendTo('.slides');

			// };
		// }
			
			//append image not available pic to the 
		// $(".pic1").attr("src", responseData["images"][0]["url"]);
		// $(".pic2").attr("src", responseData["images"][1]["url"]); 
		// $(".pic3").attr("src", responseData["images"][2]["url"]); 
		// $(".pic4").attr("src", responseData["images"][3]["url"]); 
		// $(".pic5").attr("src", responseData["images"][4]["url"]); 

		// var artistpic = $('.pics').height();
	 //    if (artistpic < 238) {
	 //        var margintop = (238 - artistpic) / 2;
	 //        $('.pics').css('margin-top', margintop);
	 //    }else{
	 //    	$('.pics').css('margin-top', 0);
	 //    };

	});

	$.getJSON(echonestApi+"search"+echonestkey+"&format=json&name="+artistNameTag+"&results=1&bucket=id:spotify").done(function(data) { 
		$(".player").removeAttr("src");
		$(".cover").removeAttr("src");
		$(".spotfylink a").removeAttr("href");
		$(".songtitle").html("");

		var responseData = data.response;
		var spotifyid=responseData["artists"][0]["foreign_ids"][0]["foreign_id"]; 	
		var spotifyidtouse = spotifyid.replace("spotify:artist:","");

		$.getJSON("https://api.spotify.com/v1/artists/"+spotifyidtouse+"/top-tracks?country=US").done(function(data){
			for (var i = 0; i <= 4; i++){
			   $("<div class='audio-player'><h1 class='songtitle'></h1><img class='cover' alt=''><audio class='player' type='audio/mp3' controls='controls'></audio></div><div class='spotfylink'><a class='spotifyopen' target='_blank'><img class='spotifylogo' src='images/listen-black.png'/></a></div>").appendTo(".top5ongs");
				$( ".audio-player" ).each(function(i) {
						$( this ).find(".songtitle").text(data["tracks"][i]["name"]);		
				    	$( this ).find(".cover").attr("src", data["tracks"][i]["album"]["images"][1]["url"]);
				    	$( this ).find(".player").attr("src", data["tracks"][i]["preview_url"]);
				});
				$(".top5ongs").each(function(i) {
					$( this ).find(".spotifyopen").attr("href", data["tracks"][i]["external_urls"]["spotify"]);
				});
			};	
		});
	});


	$.getJSON(echonestApi+"terms"+echonestkey+"name="+artistNameTag+"&format=json").done(function(data) { 
		$(".genre").html('');
		var responseData = data.response;
		$(".genre").text("Genre: " + responseData["terms"][0]["name"] + ", "+ responseData["terms"][1]["name"]+ ", "+ responseData["terms"][2]["name"] ); 
	});
	

	$.getJSON(echonestApi+"news"+echonestkey+"name="+artistNameTag+"&format=json&results=1&start=0").done(function(data) { 
		var responseData = data.response;
		$(".url a").removeAttr("href");
		$(".title").html('');
		$(".url a").html('');
		$(".summary").html('');
		$(".title").text("Related News: "+responseData["news"][0]["name"]); 
		$(".url a").attr("href", responseData["news"][0]["url"]); 
		$(".url a").text("Link: "+responseData["news"][0]["url"]); 
		$(".summary").html("Summsry: "+ responseData["news"][0]["summary"]); 
	});

	$.getJSON(echonestApi+"urls"+echonestkey+"name="+artistNameTag+"&format=json").done(function(data) { 
		$(".officialsite a").removeAttr("href");
		$(".officialsite a").html('');
		var responseData = data.response;
		$(".officialsite a").attr("href", responseData["urls"]["official_url"]); 
		$(".officialsite a").text(responseData["urls"]["official_url"]); 		
	});

	$.getJSON(echonestApi+"search"+echonestkey+"format=json&results=1&name="+artistNameTag+"&bucket=id:whosampled").done(function(data) { 
		$(".whosampleda").removeAttr("href");
		var responseData = data.response;
		var foreignids=responseData["artists"][0];
		console.log(responseData["artists"][0]);
		if(responseData["artists"][0]["foreign_ids"]===undefined){
			$(".whosampled").css("display","none");
		}else{
			$(".whosampled").css("display","block");
			var whosampledid=responseData["artists"][0]["foreign_ids"][0]["foreign_id"]; 
			var whosampledArtistid = whosampledid.match(/\d+$/)[0];
			$(".whosampleda").attr("href", "http://www.whosampled.com/artist/view/"+whosampledArtistid);
		}		   			
	});
	

	$.getJSON(echonestApi+"similar"+echonestkey+"name="+artistNameTag+"&format=json&results=5&start=0").done(function(data) { 
		$(".simipics").removeAttr("src");
		$(".simiNames").html('');
		var responseData = data.response;

		for (var i = 0; i<5; i++){
			$(".simiNames").each(function(i){
				$(this).text(responseData["artists"][i]["name"]); 
			});
		};

		for (var i = 0; i<5; i++){
			var similarid = responseData["artists"][i]["id"];
			function getResults(i, similarid) {
				$.getJSON(echonestApi+"images"+echonestkey+"id="+similarid+"&format=json&results=1&start=0&license=unknown").done(function(data) { 
					var responseData = data.response;

					console.log(responseData["images"][0]);		
					var j = 0;	
					$( ".simipics").each(function() {
						if(i==j){
							if(responseData.images[0]=== undefined){
							    $(".simipics").attr("src", "images/photo_not_available_big.jpg");
							}else{
							    $(".simipics").attr("src", responseData["images"][0]["url"]);
							};	
						}
						j++;		
					});	    	
				});
			};
		};	
	});

};
		// $(".simiName1").text(responseData["artists"][0]["name"]); 
		// 	var similarid = responseData["artists"][0]["id"];
		// 	$.getJSON(echonestApi+"images"+echonestkey+"id="+similarid+"&format=json&results=1&start=0&license=unknown").done(function(data) { 
		// 		var responseData = data.response;
		// 		$(".simipic1").attr("src", responseData["images"][0]["url"]); 
		// });
			
		// $(".simiName2").text(responseData["artists"][1]["name"]); 
		// 	var similarid = responseData["artists"][1]["id"];
		// 	$.getJSON(echonestApi+"images"+echonestkey+"id="+similarid+"&format=json&results=1&start=0&license=unknown").done(function(data) { 
		// 		var responseData = data.response;
		// 		$(".simipic2").attr("src", responseData["images"][0]["url"]); 
		// });

		// $(".simiName3").text(responseData["artists"][2]["name"]); 
		// 	var similarid = responseData["artists"][2]["id"];
		// 	$.getJSON(echonestApi+"images"+echonestkey+"id="+similarid+"&format=json&results=1&start=0&license=unknown").done(function(data) { 
		// 		var responseData = data.response;
		// 		$(".simipic3").attr("src", responseData["images"][0]["url"]); 
		// });

		// $(".simiName4").text(responseData["artists"][3]["name"]); 
		// 	var similarid = responseData["artists"][3]["id"];
		// 	$.getJSON(echonestApi+"images"+echonestkey+"id="+similarid+"&format=json&results=1&start=0&license=unknown").done(function(data) { 
		// 		var responseData = data.response;
		// 		$(".simipic4").attr("src", responseData["images"][0]["url"]); 
		// });

		// $(".simiName5").text(responseData["artists"][4]["name"]); 
		// 	var similarid = responseData["artists"][4]["id"];
		// 	$.getJSON(echonestApi+"images"+echonestkey+"id="+similarid+"&format=json&results=1&start=0&license=unknown").done(function(data) { 
		// 		var responseData = data.response;
		// 		$(".simipic5").attr("src", responseData["images"][0]["url"]); 
		// });

