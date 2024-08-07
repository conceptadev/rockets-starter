FROM maz37/rockets-node
WORKDIR /workspace
RUN git clone https://github.com/conceptadev/rockets-starter.git .
RUN yarn install