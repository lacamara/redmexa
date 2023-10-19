import React from "react";

import ConfirmContact from "./ConfirmContact";

import I18N from "@agir/lib/i18n";

export default {
  component: ConfirmContact,
  title: "CreateContactPage/ConfirmContact",
  parameters: {
    layout: "padded",
  },
};

const Template = (args) => <ConfirmContact {...args} />;

export const Default = Template.bind({});
Default.args = {
  data: {
    firstName: "Foo",
    lastName: "Bar",
    zip: "75010",
    email: "foo@bar.com",
    phone: "06 00 00 00 00",
    isPoliticalSupport: true,
    newsletters: ["LFI_reguliere", "LFI_exceptionnelle", "LFI_liaison"],
    group: {
      id: "a1a1",
      value: "a1a1a",
      label: "Nom du groupe",
      name: "Nom du groupe",
    },
    hasGroupNotifications: true,
    address: "25 passage Dubail",
    city: "Ciudad de Mexico",
    country: I18N.country,
  },
};
