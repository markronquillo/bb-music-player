# require "./lib/init"

require "rubygems"
require "sinatra"

disable :logging
set :root, File.dirname(__FILE__) + "/../"

get "/" do
  File.readlines("public/index.html")
end

get "/albums" do
  content_type "application/json"
  File.readlines("public/albums.json")
end

get "/images/:file" do
	send_file("public/assets/images/" + params[:file], :disposition => 'inline');
end

get "/favicon.ico" do
  ""
end

