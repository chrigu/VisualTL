//function User(theId, theName, noTweets) {
function User(aUser, noTweets) {
  //twitter related stuff
  this.noOfTweets = noTweets;
  //this.id = theId;
  //this.name = theName;
  this.tweets = [];
  this.user = aUser;
  
  //stuff for graphical representation
  this.x = 0;
  this.y = 0;
  this.colour = 0;
  this.width = 0; 
}

function Tweet(userName, aTweet) {
  
  this.user = userName;
  this.text = aTweet;
  this.tweetType = "Tweet"; //here I should do subclassing
  this.some = 3;
  
}

//Mention.prototype = new Tweet;
//Mention.prototype.constructor = Mention;

function Mention(fromId, toId, theType, aTweet) {
  //just don't know how I could use super in here....
  this.user = fromId;
  this.text = aTweet;
  this.to = toId;
  this.mentionType= theType; //one could do subclasses here
  this.tweetType = "Mention";
  this.some = 4;
}

function Twet(fromId, toId, theType, aTweet) {
  this.user = fromId;
  this.text = aTweet;
  this.to = toId;
  this.type = theType; //0 = tweet, 1, 1 = Mention, 2 = RT
}