FROM node:10.17.0
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN chmod 777 /opt/app
COPY . .
RUN npm install --quiet
RUN npm install nodemon -g --quiet
RUN npm install axios
RUN npm install babel-core --save
RUN npm install body-parser
RUN npm install cie10
RUN npm install cors
RUN npm install ejs
RUN npm install express
RUN npm install express-form-data
RUN npm install express-formidable
RUN npm install fs-extra
RUN npm install --save gulp-install
RUN npm install moment
RUN npm install morgan
RUN npm install multer
RUN npm install node-fetch
RUN npm install nodemon
RUN npm install scanner.js
RUN npm install sweetalert2
RUN npm install uuid
RUN npm install vue
RUN npm install --save-dev babel-cli
RUN npm install --save-dev babel-preset-env
RUN npm install --save-de babel-preset-env
RUN npm install --save-de nodemon
EXPOSE 7000
CMD nodemon -L --watch . app.js