FROM bitnami/node:latest
RUN mkdir /srv/app
RUN cd /srv/app
COPY ./ ./
RUN pwd
RUN ls -la
RUN npm install
EXPOSE 8080
EXPOSE 4000
CMD [ "nohup","npm", "run" "server", "&" ]
CMD [ "npm", "run", "dev" ]