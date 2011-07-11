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

        //processing.println(user.screen_name + " " + allUsers[user.screen_name].user.screen_name)
      }
      
      var rtee = extractRt(tweets[i].text);
      var replyTo = tweets[i].in_reply_to_screen_name;

      //not that nice, change one day....
      if(rtee != null) {
        aUser.tweets.push(new Twet(aUser.screen_name, rtee, 2, tweets[i].text));
      } else if(replyTo != null) {
        aUser.tweets.push(new Twet(aUser.screen_name, replyTo, 1, tweets[i].text));
      } else {
        a = new Tweet(aUser.screen_name, tweets[i].text);
        aUser.tweets.push(new Twet(aUser.screen_name, null, 0, tweets[i].text));
      }
           
    }
    
    //get dynamically
    var delta = (790)/noOfTweets;
    var posX = 0;
    var userNo = 1;
      
    processing.colorMode(processing.HSB, Object.size(allUsers), maxTweets,100);
    
    //iterate through users and determine their x, and y positions + the colour
    for(var username in allUsers) {
      var aUser = allUsers[username];
      
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
      
      processing.println(aUser.user.screen_name + " " + aUser.noOfTweets);
      
      for(var j = 0;j< aUser.noOfTweets;j++){
        
        var tweet = aUser.tweets[j];

        if(tweet.type == 1) {

          var receiver = allUsers[tweet.to];

          if(receiver != null) {
            processing.noFill();
            processing.stroke(100,1,90);
            var multiplicator;
            if(receiver.x - aUser.x > 800/3){
              multiplicator = 6;
            } else {
              multiplicator = 2;
            }
            
            var contr_y = posY -((maxTweets*delta) + 30*(replies + 1));
            var contr_y2 = posY + ((maxTweets*delta) + 30*(replies + 1));
            
            replies++;
            
            processing.bezier(aUser.x, aUser.y, (receiver.x-aUser.x)/4+aUser.x, contr_y, (receiver.x - aUser.x)*3/4+aUser.x, contr_y, receiver.x, receiver.y);
            processing.bezier(aUser.x, aUser.y, (receiver.x-aUser.x)/4+aUser.x, contr_y2, (receiver.x - aUser.x)*3/4+aUser.x, contr_y2, receiver.x, receiver.y);
          }
        }
        
        i++;
        
      }
    }
    
    for(var username in allUsers) {
      
      var aUser = allUsers[username];
      var i = 1;

      for(var j = 0;j< aUser.noOfTweets;j++){
        
        var tweet = aUser.tweets[j];

        //in case of an RT
        if(tweet.type == 2){
          var retweetee = allUsers[tweet.to];
          //if(tweet.mentionType == 2) {
            if(retweetee != null) {
              processing.fill(retweetee.colour, i, 100);
            } else {
              processing.fill(aUser.colour, i, 95);
            }
          //} else {
           // continue;
          //}
        } else {
          processing.fill(aUser.colour, i, 100);
        }
        
        var f = (i-1)/aUser.noOfTweets;
        var r = aUser.width*(1-f);
        processing.noStroke();
        
        //processing.println(aUser.x + " " + posY + " " + r)
        processing.ellipse(aUser.x, posY, r, r);
        
        i++;        
          
      }
      
    }
    
    users = allUsers;
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

