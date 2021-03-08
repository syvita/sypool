FROM node:latest
WORKDIR /app
COPY . .
RUN npm i
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
LABEL org.opencontainers.image.source https://github.com/mtavrse/pool/