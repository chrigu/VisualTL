function sketchProc(processing) {  
  // Override draw function, by default it will be called 60 times per second  
  processing.setup = function() {
    
    var allUsers = new Array(); //array holding all twitter users that tweeted in the timeline
    
    processing.background(255,255,255);
    
    var noOfTweets = tweets.length;
    
    for(var i=0; i < noOfTweets;++i) {
      
      var found = false;
      var user = tweets[i].user;
      
      var aUser = allUsers[user.screen_name];
      
      if(aUser != null) {
        
        aUser.noOfTweets++;
        
        
      }
      else {
        allUsers[user.screen_name] = new User(user, 1);
        var rtee = extractRt(tweets[i].text);
        var replyTo = tweets[i].in_reply_to_screen_name;
        
        processing.println(user.screen_name)
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
