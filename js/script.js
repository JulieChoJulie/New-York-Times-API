
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    // YOUR CODE GOES HERE!
    var streetStr = $('#street').val();
    var cityStr = $('#city').val()
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');
    var streetViewURL = "http://maps.googleapis.com/maps/api" +
        "/streetview?size=600x300&location=" + address;
    $body.append('<img class="bgimg" src="'+ streetViewURL +'">');


    //get New York Times article through AJAX request


    var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=b5f264c1033f41c783bf682987aa3096';

    $.getJSON(url , function(data){
        var article = data.response.docs;
        if (article.length === 0){
            $nytElem.append('<li><h5>Sorry, there was no article of <em><u>'+address+'</u></em> in New York Times</a></h5></li>');
        }
        for (var i = 0; i < Math.min(article.length, 5); i++){
            var web_url = article[i].web_url;
            $nytElem.append(
                '<li><h5><a href="'+web_url+'">'+article[i].headline.main+'</a></h5><p>'+article[i].snippet+'</p></li>');
        }
    }).fail(function (e) {
        $nytHeaderElem.text("New York Times Article Could Not Be Loaded");
    } );

    var cityNameWithNoSpace = [];
    cityStr.split('').forEach(char => {
        char === ' ' ? cityNameWithNoSpace.push('_') : cityNameWithNoSpace.push(char);
    })

    //get Wikipedia Results according to the typed address

    var wikiurl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='+cityNameWithNoSpace.join('')+"&callback=callback";
    var wikiRequestTimeOut = setTimeout(function(){
        $wikiElem.text('Failed to load Wikipedia resources.');
    }, 8000);

    $.ajax({
        url: wikiurl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function(response){
            var wikiList = response[1];
            if (wikiList.length === 0){
                $wikiElem.text('Sorry, no result was found for your address: ' + address);
            }
            wikiList.forEach(wiki => {
                var searchURL = "https://en.wikipedia.org/wiki/" + wiki;
                $wikiElem.append('<li><a href="'+searchURL+'">'+ wiki +'</a></li>');
            });
            clearTimeout(wikiRequestTimeOut);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
