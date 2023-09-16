FROM node:20-alpine AS development 

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm 

RUN pnpm install

COPY apps/payments apps/payments
COPY libs libs

# RUN pnpm install -r
RUN cd apps/payments && pnpm install 

RUN pnpm run build payments


FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm 

RUN pnpm install --production 

COPY --from=development /usr/src/app/dist ./dist 

CMD ["node", "dist/apps/payments/main"]
