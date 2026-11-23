export interface TeamMember {
  name: string;
  role: string;
  github: string;
  done: string[];
}

export const teamMembers: TeamMember[] = [
  {
    name: "Андрей Никипорчик",
    role: "Frontend-разработчик",
    github: "https://github.com/andrewfroze",
    done: [
      "Конфигурация CI/CD проекта (AI review, Build to Gh-pages)",
      "Интеграция с API https://dummyjson.com/",
      "Просмотр подробной информации о товаре",
      "Домашняя страница",
      'Страница "О нас"',
      "Просмотр итоговой стоимости корзины",
    ],
  },
  {
    name: "Максим Кондратьев",
    role: "Frontend-разработчик",
    github: "https://github.com/Kondrati3vMaksim",
    done: [
      "Изначальная конфигурация проекта",
      "Просмотр каталога",
      "Добавление товаров в корзину",
      "Изменение количества товаров в корзине",
      "Удаление товаров из корзины",
      "Сохранение состояния корзины",
    ],
  },
];
