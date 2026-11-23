import { createElement } from "../../../utils/elementFactory";
import type { TeamMember } from "./teamMembersData";

export function renderTeamMember(member: TeamMember): HTMLElement {
  const githubLink = createElement(
    "a",
    {
      className: "about-us__member-github",
      href: member.github,
      target: "_blank",
      rel: "noopener noreferrer",
    },
    ["GitHub"],
  );

  const tasks = createElement(
    "ul",
    { className: "about-us__member-tasks" },
    member.done.map((task) =>
      createElement("li", { className: "about-us__member-task" }, [task]),
    ),
  );

  return createElement("article", { className: "about-us__member" }, [
    createElement("h3", { className: "about-us__member-name" }, [member.name]),
    createElement("p", { className: "about-us__member-role" }, [member.role]),
    githubLink,
    createElement("h4", { className: "about-us__member-tasks-title" }, [
      "Выполненные задачи",
    ]),
    tasks,
  ]);
}
