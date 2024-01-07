FROM node:20-alpine AS development 

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm 

RUN pnpm install 

COPY apps/reservations apps/reservations
COPY libs libs

# RUN pnpm install -r
# RUN cd apps/reservations && pnpm install 

RUN pnpm run build reservations


FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm 

RUN pnpm install --production 

COPY --from=development /usr/src/app/dist ./dist 
COPY proto proto

CMD ["node", "dist/apps/reservations/main"]
