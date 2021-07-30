FROM node:lts-alpine
RUN apk add dumb-init
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm ci --only=production
EXPOSE 3154
USER node
CMD [ "dumb-init", "node", "./src/server.js" ]