# Используем единую среду для сборки и продакшн
FROM node:18-alpine

WORKDIR /opt/

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости с использованием yarn
RUN yarn install --frozen-lockfile

# Копируем все остальные файлы проекта
COPY . .

# Строим проект (для Strapi)
RUN yarn build

# Устанавливаем переменную окружения для продакшн-среды
ENV NODE_ENV=production

# Экспонируем порт 1337
EXPOSE 1337

# Запуск Strapi в продакшн-среде
CMD ["yarn", "start"]
