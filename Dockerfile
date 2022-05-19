FROM node:10 AS ui-build
WORKDIR /usr/src/app
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm start

FROM node:10 AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/frontend/build ./frontend/build
COPY APIs/package*.json ./APIs/
RUN cd APIs && npm install
COPY APIs/server.js ./APIs/

EXPOSE 3080

CMD ["node", "./APIs/server.js"]