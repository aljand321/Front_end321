FROM node
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN chmod 777 /opt/app
COPY . .
RUN npm install --quiet
RUN npm install nodemon -g --quiet
EXPOSE 7000
CMD nodemon -L --watch . app.js