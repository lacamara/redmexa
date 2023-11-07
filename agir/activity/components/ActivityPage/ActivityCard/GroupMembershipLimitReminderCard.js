import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";

import { routeConfig } from "@agir/front/app/routes.config";
import Link from "@agir/front/app/Link";
import GenericCardContainer from "./GenericCardContainer";

const GroupMembershipLimitReminderCard = (props) => {
  const { id, group, meta = {}, routes } = props;
  const { membershipCount, membershipLimitNotificationStep } = meta;

  const SupportGroup = group ? (
    <Link
      to={routeConfig.groupDetails.getLink({ groupPk: group.id })}
      backLink={_("activities")}
    >
      {group.name}
    </Link>
  ) : null;

  switch (membershipLimitNotificationStep) {
    case 0:
      return (
        <GenericCardContainer {...props}>
          <strong>
            {_("Action requise : votre groupe ne respecte plus la")}{" "}
            <Link
              href={`/activite/${id}/lien/`}
              params={{ next: routes.charteEquipes }}
            >
              {_("charte des groupes d'action")}
            </Link>
          </strong>
          <br />
          {SupportGroup} a atteint {membershipCount} {_("membres actifs ! Il est maintenant impossible que des nouvelles personnes la rejoignent. Divisez votre groupe en groupes plus petits maintenant pour renforcer le réseau d’action.")}
        </GenericCardContainer>
      );
    case 1:
    case 2:
      return (
        <GenericCardContainer {...props}>
          <strong>{_("Votre groupe est trop nombreux")}</strong>
          <br />
          {SupportGroup} {_("compte plus de")} {membershipCount - 1} {_("membres actifs&nbsp;! Il est temps de vous diviser en plusieurs groupes pour permettre une plus grande répartition de l’action.")}{" "}
          <Link
            href={`/activite/${id}/lien/`}
            params={{ next: routes.groupTransferHelp }}
          >
            {_("En savoir plus sur la division des groupes")}
          </Link>
        </GenericCardContainer>
      );
    case 3:
      return (
        <GenericCardContainer {...props}>
          <strong>
            {_("Gardez un oeil sur le nombre de membres de votre groupe")}
          </strong>
          <br />
          {SupportGroup} {_("a dépassé les")} {membershipCount - 1} {_("membres actifs ! Afin que chacun·e puisse s'impliquer et pour permettre une plus grande répartition de votre action, nous vous invitons à diviser votre groupe.")}{" "}
          <Link
            href={`/activite/${id}/lien/`}
            params={{ next: routes.groupTransferHelp }}
          >
            {_("En savoir plus sur la division des groupes")}
          </Link>
        </GenericCardContainer>
      );
    default:
      return (
        <GenericCardContainer {...props}>
          <strong>
            {_("Bravo, vous êtes maintenant")} {membershipCount || _("nombreux·ses")} {_("dans votre groupe&nbsp;!")}
          </strong>
          <br />
          {SupportGroup} {_("a atteint le nombre idéal de membres actifs. Désormais, favorisez la création d'autres groupes autour de chez vous par d’autres membres, de manière à renforcer le réseau d'action.")}
        </GenericCardContainer>
      );
  }
};
GroupMembershipLimitReminderCard.propTypes = {
  id: PropTypes.number.isRequired,
  group: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string,
    routes: PropTypes.shape({
      membershipTransfer: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    membershipLimit: PropTypes.number,
    membershipCount: PropTypes.number,
    membershipLimitNotificationStep: PropTypes.number,
  }),
  routes: PropTypes.shape({
    groupTransferHelp: PropTypes.string.isRequired,
    charteEquipes: PropTypes.string.isRequired,
  }).isRequired,
  timestamp: PropTypes.string,
  config: PropTypes.shape({
    icon: PropTypes.string,
  }),
};

export default GroupMembershipLimitReminderCard;
