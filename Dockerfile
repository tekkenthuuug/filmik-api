FROM node:12.16.1

WORKDIR /usr/src/filmik-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]
