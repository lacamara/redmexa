import React from "react";

import user from "@agir/front/mockData/user";

import style from "@agir/front/genericComponents/_variables.scss";

import { DesktopNavBar } from "./DesktopNavBar";

export default {
  component: DesktopNavBar,
  title: "TopBar/Desktop/NavBar",
  parameters: {
    backgrounds: { default: "black50" },
  },
};

const Template = (args, { globals }) => (
  <div
    style={{
      height: 72,
      position: "relative",
      width: "100%",
      background: "white",
      boxShadow: style.elaborateShadow,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <DesktopNavBar user={globals.auth === "authenticated" && user} {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  path: "/",
  unreadMessageCount: 3,
  unreadActivityCount: 10,
};

export const WithAdminLink = Template.bind({});
WithAdminLink.args = {
  ...Default.args,
  adminLink: { to: "/admin" },
};
