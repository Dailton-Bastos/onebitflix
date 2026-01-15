FROM node:22-alpine AS base

WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json yarn.lock /temp/dev/
RUN cd /temp/dev && yarn install

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json yarn.lock /temp/prod/
RUN cd /temp/prod && yarn install --frozen-lockfile --production

# copy all (non-ignored) project files into the image
FROM base AS prerelease

COPY --from=install /temp/dev/node_modules ./node_modules
COPY src ./src
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

# build the application
RUN yarn build

# copy development dependencies and source code into final image
FROM base AS development

RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.2.1/zsh-in-docker.sh)" -- \
    -p https://github.com/zsh-users/zsh-autosuggestions \
    -p https://github.com/zsh-users/zsh-syntax-highlighting \
    -p https://github.com/zsh-users/zsh-completions

COPY --from=install /temp/dev/node_modules ./node_modules
COPY --from=install /temp/dev/yarn.lock .
COPY --from=prerelease /usr/src/app/dist ./dist
COPY . .

# start the application
CMD ["yarn", "run", "start:dev"]

# copy production dependencies and dist folder into final image
FROM base AS production

COPY --from=install /temp/prod/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/dist ./dist

CMD ["node", "dist/main"]

# test Stage
FROM base AS test

WORKDIR /usr/src/app

COPY src ./src
COPY test ./test
COPY package.json ./package.json
COPY tsconfig.json ./tsconfig.json

RUN yarn install --frozen-lockfile

# run the tests
CMD ["yarn", "run", "test:e2e"]
