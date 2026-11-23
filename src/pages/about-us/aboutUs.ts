import { createElement } from "../../utils/elementFactory";

import "./aboutUs.css";
import { renderTeam } from "./components/teamMembers";

export function renderAboutUs(): HTMLElement {
  const heading = createElement("p", { className: "about-us__eyebrow" }, [
    "О ПРОЕКТЕ A&M",
  ]);

  const title = createElement("h2", { className: "about-us__title" }, [
    "Удобные покупки без лишних усилий.",
  ]);

  const description = createElement(
    "p",
    { className: "about-us__description" },
    [
      "A&M — это современный интернет-магазин, созданный для того, чтобы поиск и выбор товаров были простыми и приятными. Изучайте тщательно подобранный ассортимент, сравнивайте характеристики и находите то, что подходит для повседневной жизни.",
    ],
  );

  const projectInfo = createElement(
    "div",
    { className: "about-us__project-info" },
    [
      createElement("h3", {}, ["О нашем проекте"]),
      createElement("p", {}, [
        "Это приложение создано в рамках командного проекта, чтобы продемонстрировать современные подходы к frontend-разработке, использование TypeScript, интеграцию API и создание адаптивных пользовательских интерфейсов.",
      ]),
    ],
  );

  return createElement(
    "section",
    {
      className: "about-us",
      id: "about-us",
    },
    [
      createElement("div", { className: "about-us__intro" }, [
        heading,
        title,
        description,
        projectInfo,
      ]),
      renderTeam(),
    ],
  );
}
