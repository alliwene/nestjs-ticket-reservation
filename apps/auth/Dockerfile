FROM node:20-alpine AS development 

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm 

RUN pnpm install

COPY apps/auth apps/auth
COPY libs libs

# RUN pnpm install -r
RUN cd apps/auth && pnpm install 

RUN pnpm run build auth


FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm 

RUN pnpm install --production 

COPY --from=development /usr/src/app/dist ./dist 
COPY proto proto

CMD ["node", "dist/apps/auth/main"]
