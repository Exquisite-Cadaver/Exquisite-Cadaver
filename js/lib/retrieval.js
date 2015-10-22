
//Modify this variable after migrating the api to heroku
var API_URL = 'https://exquisite-cadaver-loopback-cathe313.c9.io/api/';


// Data retrieval functions
function startNewStory(){
    return $.getJSON(API_URL + 'Stories').then(
        function(result) {
            var newStoryId = result.length + 1;
            return $.getJSON(API_URL + 'Lines').then(
                function(linesResult){
                    var newLineId = linesResult.length;
                    return {
                        newLineId: newLineId,
                        newStoryId: newStoryId
                    }
                }
            )
        }
    )
}

function getStoriesByRating(pageNum) {
    return $.getJSON(API_URL + 'Stories?filter={"order":"rating%20DESC","skip":' + pageNum * 2 + ',"limit":' + (2 + 1) + ',"where":{"incomplete":"false"}}').then(
        function(result) {
            if (result.length > 2) {  //storyNb
                var hasNextPage = true;
                result = result.slice(0, 2); //storyNb
            }
            else {
                hasNextPage = false;
            }
            
            return {
                hasNextPage: hasNextPage,
                arrayOfStories: result
            };
        }
    );
}

function getStoriesLines(story) {
    var id = story.id;
    return $.getJSON(API_URL + 'Stories/' + id + '/Lines?filter={"fields":"lineText"}');
}

function getRandomStory() {
    var arrayOfStories = [];
    return $.getJSON(API_URL + 'Stories').then(
        function(result) {
            //collects in an array the ids of the stories that have been completed
            result.forEach(function(story) {
                if (story.incomplete === false) {
                    arrayOfStories.push(story.id);
                }
            });
        }
    ).then(
        function() {
            //this will return one of the array's id at random
            var poz = Math.floor( Math.random() * arrayOfStories.length );
            return arrayOfStories[poz];
        }
    ).then(
        function(storyId) {
            //gets all the lines from the story randomly chosen above
            return $.getJSON(API_URL + 'Stories/' + storyId + '/Lines');
        }    
    );        
}

function getIncompleteStory(){
    var arrayOfStories = [];
    return $.getJSON(API_URL + 'Stories').then(
        function(result) {
            //collects in an array the ids of the stories that have been completed
            result.forEach(function(story) {
                if (story.incomplete === true) {
                    arrayOfStories.push(story.id);
                }
            });
        }
    ).then(
        function() {
            if (arrayOfStories.length === 0) {
                var exist = false;
            }
            else {
                exist = true;
                //this will return one of the array's id at random
                var poz = Math.floor( Math.random() * arrayOfStories.length );
                return {
                    'storyId': arrayOfStories[poz],
                    'exist': exist
                };
            }    
        }
    );       
}

function getLines(storyId){
    return $.getJSON(API_URL + 'Stories/' + storyId + '/Lines');
}



module.exports = {
    'getRandomStory': getRandomStory,
    'API_URL': API_URL,
    'getStoriesLines': getStoriesLines,
    'getStoriesByRating': getStoriesByRating,
    'getIncompleteStory': getIncompleteStory,
    'getLines': getLines,
    'startNewStory': startNewStory
};
            