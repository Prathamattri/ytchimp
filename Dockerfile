FROM node:20.5.1

WORKDIR /base
COPY ["apps/backend-server","./apps/backend-server"]
COPY ["packages","./packages"]
COPY ["package.json", "./package.json"]
COPY ["tsconfig.json","./tsconfig"]
COPY ["turbo.json","./turbo.json"]

RUN npm install
RUN npm install -g nodemon
RUN cd /base/packages/database && npx prisma generate

EXPOSE 3001
WORKDIR /base/apps/backend-server
RUN npm run build
COPY ["apps/backend-server/src/utils/oauth.json","./dist/oauth.json"]

CMD ["nodemon","./dist/index.js"]
