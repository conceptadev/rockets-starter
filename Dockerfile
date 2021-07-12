FROM node:16-alpine
WORKDIR /usr/src/app
ENV NODE_ENV development
ENV PATH "/workspace/node_modules/.bin:${PATH}"
RUN apk add bash
RUN apk add bash-completion
RUN apk add git
RUN apk add git-bash-completion
RUN apk add openssh-client
RUN echo 'source /usr/share/bash-completion/bash_completion' >> ~/.bashrc
RUN echo 'source /usr/share/bash-completion/completions/git' >> ~/.bashrc
RUN sed -i -e "s/bin\/ash/bin\/bash/" /etc/passwd