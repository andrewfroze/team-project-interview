import { createElement } from "../../../utils/elementFactory";
import { renderTeamMember } from "./teamMemberCard";
import { teamMembers } from "./teamMembersData";

import "./temMemberCard.css";

export function renderTeam(): HTMLElement {
  const heading = createElement("h2", {}, ["Наша команда"]);

  const members = createElement(
    "div",
    { className: "about-us__team" },
    teamMembers.map(renderTeamMember),
  );

  return createElement("div", { className: "about-us__team-section" }, [
    heading,
    members,
  ]);
}
