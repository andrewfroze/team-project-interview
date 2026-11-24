# A&M — интернет-магазин

Учебный командный frontend-проект RS School. A&M — клиентское веб-приложение интернет-магазина с каталогом товаров, поиском, фильтрацией, сортировкой и корзиной.

- **Демо:** https://andrewfroze.github.io/team-project-interview/
- **Issues:** https://github.com/andrewfroze/team-project-interview/issues
- **Wiki:** https://github.com/andrewfroze/team-project-interview/wiki

## Возможности

- Главная страница с промоблоком и подборкой товаров.
- Каталог товаров с данными из DummyJSON.
- Поиск по названию с debounce и отменой устаревших запросов.
- Фильтрация по категориям.
- Сортировка по названию, цене, рейтингу и размеру скидки.
- Пагинация каталога.
- Отдельная страница подробной информации о товаре.
- Корзина: добавление, изменение количества и удаление позиций.
- Сохранение корзины в LocalStorage.
- Расчёт стоимости позиций и общей суммы с учётом скидок.
- Адаптивный интерфейс, включая свайп для открытия действия удаления товара.
- Ночной режим с эффектом подсветки («фонарик»).
- Toast-уведомления об успешных действиях и ошибках.
- Страница About Us с информацией о проекте и команде.

## Технологии

- **TypeScript** — основной язык приложения.
- **Vite** — локальный сервер и production-сборка.
- **HTML / CSS** — интерфейс без UI-фреймворков.
- **Vitest** — тестирование.
- **DummyJSON** — REST API каталога и карточек товаров.
- **ESLint + typescript-eslint** — статический анализ.
- **Prettier** — форматирование.
- **Husky + lint-staged** — Git hooks.
- **GitHub Actions + GitHub Pages** — автоматизация и публикация.

## Быстрый старт

Требуются Node.js 22 и npm.

```bash
git clone https://github.com/andrewfroze/team-project-interview.git
cd team-project-interview
npm install
npm run dev
```

Vite выведет локальный адрес приложения в терминал.

## Команды

| Команда           | Назначение                                                               |
| ----------------- | ------------------------------------------------------------------------ |
| `npm run dev`     | Запустить локальный сервер разработки                                    |
| `npm run build`   | Проверить TypeScript и собрать production-версию в `dist/`               |
| `npm run preview` | Запустить локальный просмотр production-сборки                           |
| `npm run test`    | Запустить тесты Vitest                                                   |
| `npm run lint`    | Проверить код с ESLint                                                   |
| `npm run format`  | Отформатировать файлы с Prettier                                         |
| `npm run deploy`  | Собрать проект, создать fallback для GitHub Pages и опубликовать `dist/` |

## Структура проекта

```text
src/
├── api/             # HTTP-запросы, API-клиент и валидаторы ответов
├── cart/            # Состояние корзины и расчёты стоимости
├── components/      # Повторно используемые компоненты интерфейса
├── layouts/         # Общий layout приложения
├── models/          # TypeScript-модели
├── pages/           # Главная, каталог, товар, корзина, About Us и error page
├── router/          # Работа с URL и путями приложения
├── styles/          # Базовые стили и CSS-переменные
├── utils/           # Фабрики DOM-элементов и вспомогательная логика
└── validators/      # Проверки данных, включая данные корзины
scripts/             # Скрипты сборки и публикации
.github/workflows/   # GitHub Actions
.husky/              # Git hooks
```

## Данные и хранение

Каталог и карточки товаров загружаются из [DummyJSON Products API](https://dummyjson.com/docs/products). Корзина хранится на стороне клиента в LocalStorage под ключом `shop-cart`; она не зависит от имитации операций корзины на стороне DummyJSON.

При восстановлении корзины сохранённые данные проходят runtime-валидацию. Некорректные данные не должны приводить к падению приложения.

## Проверки качества и CI/CD

- Перед коммитом Husky запускает `lint-staged`: ESLint с автоисправлением и Prettier для staged-файлов.
- Перед push Husky запускает `npm run test`.
- GitHub Actions публикует приложение на GitHub Pages после закрытия PR в `main`, если PR был объединён.
- Отдельный workflow AI Code Review запускает проверку PR в `main`. Для него требуется GitHub Actions secret `OPENROUTER_API_KEY`.

## Команда

Проект разрабатывается в паре:

- [andrewfroze](https://github.com/andrewfroze)
- [Kondrati3vMaksim](https://github.com/Kondrati3vMaksim)
