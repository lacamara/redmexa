import _ from "gettext";
import { DateTime, Interval } from "luxon";

import I18N from "@agir/lib/i18n";

export const DOOR2DOOR_EVENT_SUBTYPE_LABEL = "porte-a-porte";

export const EVENT_DEFAULT_DURATIONS = [
  {
    value: 60,
    label: "1h",
  },
  {
    value: 90,
    label: "1h30",
  },
  {
    value: 120,
    label: "2h",
  },
  {
    value: 180,
    label: "3h",
  },
  {
    value: null,
    label: "Personnalisée",
  },
];

export const EVENT_TYPES = {
  A: {
    label: _("Action publique"),
    description:
      _("Une action qui se déroulera dans un lieu public et qui aura comme objectif principal  d'aller à la rencontre ou d'atteindre des personnes extérieures à la France insoumise"),
  },
  M: {
    label: _("Événement public"),
    description:
      _("Un événement ouvert à tous les publics, au-delà des membres du groupe, mais qui aura lieu dans un lieu privé. Par exemple, un événement public avec un orateur, une projection ou un concert"),
  },
  G: {
    label: _("Réunion privée de groupe"),
    description:
      _("Une réunion qui concerne principalement les membres du groupes, et non le public de façon générale. Par exemple, la réunion hebdomadaire du groupe, une réunion de travail, ou l'audition d'une association"),
  },
  O: {
    label: _("Autre"),
    description:
      _("Tout autre type d'événement qui ne rentre pas dans les autres catégories"),
  },
};

export const PRIVATE_EVENT_SUBTYPE_INFO =
  _("Seuls les membres des groupes organisateurs pourront participer à l'événement.");

export const FOR_GROUP_TYPE_EVENT_SUBTYPE_INFO =
  _("Ce type d'événement est reservé aux groupes du type « :type ».");

export const FOR_GROUPS_EVENT_SUBTYPE_INFO =
  _("Ce type d'événement est reservé aux groupes suivants : ");

export const getEventSubtypeInfo = (subtype) => {
  let info = "";
  if (!subtype) {
    return info;
  }
  if (subtype.isPrivate) {
    info += PRIVATE_EVENT_SUBTYPE_INFO;
  }
  if (subtype.forGroupType) {
    info += `\n${FOR_GROUP_TYPE_EVENT_SUBTYPE_INFO.replace(
      ":type",
      subtype.forGroupType,
    )}`;
  }
  if (subtype.forGroups && subtype.forGroups.length > 0) {
    info += `\n${FOR_GROUPS_EVENT_SUBTYPE_INFO}`;
    subtype.forGroups.forEach((group) => {
      info += `\n— ${group.name}`;
    });
  }
  return info.trim();
};

export const formatEvent = (event) => {
  if (!event) {
    return null;
  }

  if (!event.startTime || !event.endTime) {
    return event;
  }

  try {
    const startDateTime = DateTime.fromJSDate(
      new Date(event.startTime),
    ).setLocale(I18N.locale);
    const endDateTime = DateTime.fromJSDate(new Date(event.endTime)).setLocale(
      I18N.locale,
    );
    return {
      ...event,
      schedule: Interval.fromDateTimes(startDateTime, endDateTime),
    };
  } catch (e) {
    return event;
  }
};
