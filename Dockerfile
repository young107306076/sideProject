FROM node

RUN mkdir /website

WORKDIR /website

ADD ./website /website

RUN npm install

RUN npm install xhr2

CMD ["node", "./app.js"]