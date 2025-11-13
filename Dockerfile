# syntax=docker/dockerfile:1
FROM ruby:3.3-alpine

# Install build tools and PostgreSQL client libraries for the pg gem
RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    tzdata

WORKDIR /app

# Install application dependencies
COPY Gemfile* ./
RUN bundle install --jobs=4

# Copy the rest of the application code
COPY . .

# Ensure APP_SESSION_SECRET is available at runtime (provided via .env)
ENV APP_SESSION_SECRET=

EXPOSE 3001

CMD ["bundle", "exec", "rackup", "--host", "0.0.0.0", "--port", "3001"]
