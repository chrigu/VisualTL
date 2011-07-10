function sketchProc(processing) {  
  // Override draw function, by default it will be called 60 times per second  
  processing.setup = function() {
    
    var allUsers = new Object(); //"associative array" holding all twitter users that tweeted in the timeline
    Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
    };

    
    processing.background(255,255,255);
    processing.size(800,600);
    
    var noOfTweets = tweets.length;
    var maxTweets = 0;
    var posY = 300;
    
    for(var i=0; i < noOfTweets;++i) {
      
      var found = false;
      var user = tweets[i].user;
      
      var aUser = allUsers[user.screen_name];
      
      if(aUser != null) {  
        aUser.noOfTweets++;
        
        if(aUser.noOfTweets > maxTweets) {
          maxTweets = aUser.noOfTweets;
        }
        
      }
      else {
        aUser = new User(user, 1);
        allUsers[user.screen_name] = aUser;

        processing.println(user.screen_name + " " + allUsers[user.screen_name].user.screen_name)
      }
      
      var rtee = extractRt(tweets[i].text);
      var replyTo = tweets[i].in_reply_to_screen_name;
      
      //not that nice, change one day....
      if(rtee != null) {
        aUser.tweets.push(new Mention(aUser.screen_name, rtee, 0, tweets[i].text));
      } else if(replyTo != "") {
        aUser.tweets.push(new Mention(aUser.screen_name, rtee, 1, tweets[i].text));
      } else {
        aUser.tweets.push(new Tweet(aUser.screen_name, tweets[i].text));
      }
           
    }
    
    //get dynamically
    var delta = (790)/noOfTweets;
    var posX = 0;
    var userNo = 1;
      
    processing.colorMode(processing.HSB, Object.size(allUsers), maxTweets,100);
    //processing.println(processing.HSB + " " + Object.size(allUsers) + " " + maxTweets)
    
    //iterate through users and determine their x, and y positions + the colour
    for(var username in allUsers) {
      var aUser = allUsers[username];
      
      //processing.println(username);
      
      var user_width = aUser.noOfTweets * delta;
      aUser.width = user_width;
      
      aUser.x = posX + user_width/2;
      aUser.y = 300;
      
      aUser.colour = userNo;
      posX += user_width + 1;
      userNo++;
    }
    
    for(var username in allUsers) {
      var aUser = allUsers[username];
      
      var i = 1;
      var replies = 0;
      
      for(var j = 0;j< aUser.tweets.length;j++){
        
        var tweet = tweets[j];
        
        if(getObjectClass(tweet) == "Mention"){
          var retweetee = allUsers[tweet.to];
          if(tweet.type == 0) {
            if(retweetee != null) {
              processing.fill(retweetee.colour, i, 100);
            } else {
              processing.fill(aUser.colour, i, 95);
            }
          } else {
            continue;
          }
        } else {
          processing.fill(aUser.colour, i, 100);
        }
        
        var f = (i-1)/aUser.noOfTweets;
        var r = aUser.width*(1-f);
        processing.noStroke();
        
        processing.println(aUser.x + " " + posY + " " + r)
        processing.ellipse(aUser.x, posY, r, r);
        
        i++;        
          
      }
      
    }
    
  }; 

  processing.draw = function() {  
 
  };  
    
}  
  
var canvas = document.getElementById("canvas1");  
// attaching the sketchProc function to the canvas  
var p = new Processing(canvas, sketchProc);  
// p.exit(); to detach it


//Extracts the user that's being retweeted
function extractRt(aTweet){
  splitString0 = aTweet.split("RT+\\s+@");
  if(splitString0.length > 1) {
    //System.out.println(splitString0[1]);
    splitString2 = splitString0[1].split(":\\s+");
    if(splitString2.length > 0) {
      return splitString2[0];
     }
   } 
   return null;
}

//get class name
function getObjectClass(obj) {
    if (obj && obj.constructor && obj.constructor.toString) {
        var arr = obj.constructor.toString().match(
            /function\s*(\w+)/);

        if (arr && arr.length == 2) {
            return arr[1];
        }
    }

    return undefined;
}
