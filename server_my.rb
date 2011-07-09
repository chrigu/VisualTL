#!/usr/bin/ruby

require 'rubygems'
require 'sinatra'
require 'twitter_oauth'
require 'erb'

enable :logging
#enable :sessions
set :environment, :development
#set :sessions, true

use Rack::Session::Cookie, :key => 'rack.session',
                              :domain => 'localhost.',
                               :path => '/',
                               :expire_after => 2592000
 #                              :secret => 'change_me'


#https://github.com/moomerman/sinitter/blob/master/sinitter.rb

before do
  #@user = session[:user]
  @client = TwitterOAuth::Client.new(
    :consumer_key => CONSUMER_KEY,
    :consumer_secret => CONSUMER_SECRET,
    :token => session[:access_token],
    :secret => session[:secret_token]
  )
  #@rate_limit_status = @client.rate_limit_status
end

get '/' do
  redirect '/index.html'
end

get '/doLogin' do
  
  oauth_confirm_url = "http://localhost:4567/login/complete"  
  
  request_token = @client.request_token(:oauth_callback => oauth_confirm_url)
  #:oauth_callback required for web apps, since oauth gem by default force PIN-based flow 
  #( see http://groups.google.com/group/twitter-development-talk/browse_thread/thread/472500cfe9e7cdb9/848f834227d3e64d )


  session[:token] = request_token.token
  session[:secret] = request_token.secret
  

  redirect request_token.authorize_url
end

get '/login/complete' do
  
  begin
    @access_token = @client.authorize(session[:token] ,session[:secret] ,:oauth_verifier => params[:oauth_verifier])
  rescue OAuth::Unauthorized
  end
  
  if @client.authorized?
    "Nope. NOT"
  else
    "no"
  end

end

get '/test' do
  "session = "  << session[:token].inspect
end

get '/random' do
  
  word = Word.random(1)[0]
  word.to_json
  
end

get '/', :agent => /^.*iPhone|iPod|iPad|Android\*?/ do
  
  redirect '/index_mob.html'

end





  