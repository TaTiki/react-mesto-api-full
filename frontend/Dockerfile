FROM node:16-alpine

WORKDIR /app
COPY package.json yarn.lock /
RUN yarn install
RUN yarn global add react-scripts@4.0.3
COPY . .
CMD yarn run start
