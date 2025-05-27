FROM node:18-alpine

WORKDIR /opt/app

# Копируем зависимости и устанавливаем их
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Копируем исходный код
COPY . .

# Создаем папку uploads и устанавливаем права
RUN mkdir -p public/uploads && \
    chown -R node:node /opt/app

# Сборка проекта
RUN yarn build

# Переключаемся на пользователя node
USER node

ENV NODE_ENV=production
EXPOSE 1337

CMD ["yarn", "start"]