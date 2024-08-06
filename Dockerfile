FROM node:latest
WORKDIR /workspace
RUN git clone https://github.com/conceptadev/rockets-starter.git .
RUN yarn install --frozen-lockfile
