import React from "react";

import ObjectManagement from "@agir/front/genericComponents/ObjectManagement";
import { MENU_ITEMS_GROUP } from "@agir/groups/groupPage/GroupSettings/group_items.js";

import { useGroup } from "@agir/groups/groupPage/hooks/group.js";

export const GroupSettingsGeneral = (props) => {
  const { groupPk } = props;
  const group = useGroup(groupPk);

  return (
    <ObjectManagement
      object={group}
      route="/groupes/:groupPk/parametres/"
      menu_items={MENU_ITEMS_GROUP}
      selected_item={MENU_ITEMS_GROUP.general.id}
      {...props}
    />
  );
};
GroupSettingsGeneral.propTypes = {};

export default GroupSettingsGeneral;
