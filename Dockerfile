FROM ruby:3.3-alpine

RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    git \
    tzdata

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

ENV RACK_ENV=production
EXPOSE 3001

CMD ["bundle", "exec", "ruby", "app.rb"]
