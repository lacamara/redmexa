import _ from "gettext";
import { lazy } from "@agir/front/app/utils";
import {
  RouteConfig,
  routeConfig as globalRouteConfig,
} from "@agir/front/app/routes.config";

import illustrationManage from "@agir/front/genericComponents/images/group_members.svg";
import illustrationGeneral from "@agir/front/genericComponents/images/group_general.svg";
import illustrationContact from "@agir/front/genericComponents/images/group_contact.svg";
import illustrationLinks from "@agir/front/genericComponents/images/group_links.svg";
import illustrationHelp from "@agir/front/genericComponents/images/group_help.svg";

const GroupSettingsReadOnlyMembers = lazy(() =>
  import(
    /* webpackChunkName: "r-groupsettingsreadonlymembers" */ "@agir/groups/groupPage/GroupSettings/GroupReadOnlyMembersPage"
  ),
);
const GroupSettingsActiveMembers = lazy(() =>
  import(
    /* webpackChunkName: "r-groupsettingsactivemembers" */ "@agir/groups/groupPage/GroupSettings/GroupActiveMembersPage"
  ),
);
const GroupSettingsContacts = lazy(() =>
  import(
    /* webpackChunkName: "r-groupsettingscontacts" */ "@agir/groups/groupPage/GroupSettings/GroupContactsPage"
  ),
);
const GroupSettingsManage = lazy(() =>
  import(
    /* webpackChunkName: "r-groupsettingsmanage" */ "@agir/groups/groupPage/GroupSettings/GroupManagementPage"
  ),
);
const GroupSettingsMateriel = lazy(() =>
  import(
    /* webpackChunkName: "r-groupsettingsmateriel" */ "@agir/groups/groupPage/GroupSettings/GroupMaterielPage"
  ),
);
const GroupSettingsGeneral = lazy(() =>
  import(
    /* webpackChunkName: "r-groupsettingsgeneral" */ "@agir/groups/groupPage/GroupSettings/GroupGeneralPage"
  ),
);
const GroupSettingsLocation = lazy(() =>
  import(
    /* webpackChunkName: "r-groupsettingslocation" */ "@agir/groups/groupPage/GroupSettings/GroupLocalizationPage"
  ),
);
const GroupSettingsContact = lazy(() =>
  import(
    /* webpackChunkName: "r-groupsettingscontact" */ "@agir/groups/groupPage/GroupSettings/GroupContactPage"
  ),
);
const GroupSettingsLinks = lazy(() =>
  import(
    /* webpackChunkName: "r-groupsettingslinks" */ "@agir/groups/groupPage/GroupSettings/GroupLinksPage"
  ),
);
const GroupSettingsCertification = lazy(() =>
  import(
    /* webpackChunkName: "r-groupsettingscertification" */ "@agir/groups/groupPage/GroupSettings/GroupCertificationPage"
  ),
);
const GroupSettingsHelp = lazy(() =>
  import(
    /* webpackChunkName: "r-groupsettingshelp" */ "@agir/groups/groupPage/GroupSettings/GroupHelpPage"
  ),
);

export const menuRoute = {
  id: "menu",
  path: "gestion/",
  exact: false,
  label: _("Paramètres du groupe"),
};

export const routeConfig = {
  members: {
    id: "members",
    path: "membres/",
    exact: true,
    label: "Participantes activos",
    icon: "users",
    getComponent: (group) =>
      group.isEditable
        ? GroupSettingsActiveMembers
        : GroupSettingsReadOnlyMembers,
    isActive: true,
    menuGroup: 1,
  },
  contacts: {
    id: "contacts",
    path: "contacts/",
    exact: true,
    label: "Seguidores",
    icon: "rss",
    Component: GroupSettingsContacts,
    isActive: (group) => group.isEditable,
    menuGroup: 1,
  },
  manage: {
    id: "manage",
    path: "animation/",
    exact: true,
    label: _("Gestion et animation"),
    icon: "lock",
    Component: GroupSettingsManage,
    illustration: illustrationManage,
    isActive: (group) => group.isEditable,
    menuGroup: 1,
  },
  certification: {
    id: "certification",
    path: "certification/",
    exact: true,
    label: _("Certification"),
    icon: "check-circle",
    Component: GroupSettingsCertification,
    isActive: (group) => group.isCertifiable || group.isCertified,
    menuGroup: 1,
  },
  materiel: {
    id: "materiel",
    path: "materiel/",
    exact: true,
    label: _("Matériel"),
    icon: "shopping-bag",
    Component: GroupSettingsMateriel,
    isActive: true,
    menuGroup: 1,
  },
  general: {
    id: "general",
    path: "general/",
    exact: true,
    label: "Datos generales",
    icon: "file-text",
    Component: GroupSettingsGeneral,
    illustration: illustrationGeneral,
    isActive: (group) => group.isEditable,
    menuGroup: 2,
  },
  location: {
    id: "location",
    path: "localisation/",
    exact: true,
    label: "Ubicación",
    icon: "map-pin",
    Component: GroupSettingsLocation,
    isActive: (group) => group.isEditable,
    menuGroup: 2,
  },
  contact: {
    id: "contact",
    path: "contact/",
    exact: true,
    label: _("Moyens de contact"),
    icon: "mail",
    Component: GroupSettingsContact,
    illustration: illustrationContact,
    isActive: (group) => group.isEditable,
    menuGroup: 2,
  },
  links: {
    id: "links",
    path: "liens/",
    exact: true,
    label: "Enlaces y redes sociales",
    icon: "at-sign",
    Component: GroupSettingsLinks,
    illustration: illustrationLinks,
    isActive: true,
    menuGroup: 2,
  },
  help: {
    id: "help",
    path: "ressources/",
    exact: true,
    label: "Información útil",
    icon: "more-horizontal",
    Component: GroupSettingsHelp,
    externalLink: "https://info.claudializate.com/",
    illustration: illustrationHelp,
    isActive: true,
    menuGroup: 3,
  },
};

export const getMenuRoute = (basePath) =>
  new RouteConfig({
    ...menuRoute,
    path: basePath + menuRoute.path,
  });

const getActiveRoutes = (group) =>
  Object.values(routeConfig).filter((route) => {
    if (!group || !group.isManager) {
      return false;
    }
    if (typeof route.isActive === "function") {
      return !!route.isActive(group);
    }
    return !!route.isActive;
  });

export const getRoutes = (basePath, group) =>
  getActiveRoutes(group).map(
    (route) =>
      new RouteConfig({
        ...route,
        Component:
          typeof route.getComponent === "function"
            ? route.getComponent(group)
            : route.Component,
        path: basePath + menuRoute.path + route.path,
      }),
  );

export const getGroupSettingLinks = (group, basePath) => {
  const links = {};

  if (!group?.id || !group.isManager) {
    return links;
  }

  if (!basePath) {
    const activeRoutes = getActiveRoutes(group);
    links.menu = globalRouteConfig.groupSettings.getLink({
      groupPk: group.id,
    });
    activeRoutes.forEach((route) => {
      links[route.id] = globalRouteConfig.groupSettings.getLink({
        activePanel: route.path.replace("/", "") || null,
        groupPk: group.id,
      });
    });
    return links;
  }

  const activeRoutes = getRoutes(basePath, group);
  links.menu = getMenuRoute(basePath).getLink();
  activeRoutes.forEach((route) => {
    links[route.id] = route.getLink();
  });

  return links;
};

export default getRoutes;
