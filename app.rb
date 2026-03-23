# frozen_string_literal: true

require "sinatra"

set :bind, "0.0.0.0"
set :port, ENV.fetch("PORT", 3001)
set :session_secret, ENV.fetch("APP_SESSION_SECRET")
enable :sessions

get "/" do
  "Old School Shuffle is up"
end

get "/health" do
  content_type :json
  '{"status":"ok"}'
end
