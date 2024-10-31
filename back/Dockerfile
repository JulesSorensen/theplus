FROM node:20.8.0-slim as init

COPY . /
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
