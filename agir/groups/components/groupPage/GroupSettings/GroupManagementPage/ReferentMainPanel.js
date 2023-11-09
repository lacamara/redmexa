import _ from "gettext";
import PropTypes from "prop-types";
import React, { useMemo } from "react";

import style from "@agir/front/genericComponents/_variables.scss";

import GroupMemberList from "@agir/groups/groupPage/GroupSettings/GroupMemberList";
import { RawFeatherIcon as FeatherIcon } from "@agir/front/genericComponents/FeatherIcon";
import Spacer from "@agir/front/genericComponents/Spacer";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents";

import { MEMBERSHIP_TYPES } from "@agir/groups/utils/group";

export const ReferentMainPanel = (props) => {
  const { routes, addManager, addReferent, isLoading, members, onClickMember } =
    props;

  const referents = useMemo(
    () =>
      members.filter(
        (member) => member.membershipType === MEMBERSHIP_TYPES.REFERENT,
      ),
    [members],
  );

  const managers = useMemo(
    () =>
      members.filter(
        (member) => member.membershipType === MEMBERSHIP_TYPES.MANAGER,
      ),
    [members],
  );

  return (
    <>
      <StyledTitle>{_("Animateurs et animatrices")}</StyledTitle>
      <span style={{ color: style.black700 }}>
        {_("Les animateur·ices organisent la vie du groupe.")}
      </span>
      <Spacer size=".5rem" />
      <span style={{ color: style.black700 }}>
        {_("Pour respecter la")}{" "}
        <a href="https://infos.actionpopulaire.fr/charte-des-groupes-action-populaire/">
          {_("charte des groupes d'actions")}
        </a>
        {_(", votre groupe doit être animé à parité de genre.")}
      </span>
      <Spacer size="1.5rem" />
      <GroupMemberList
        members={referents}
        addButtonLabel={_("Ajouter votre binôme")}
        onAdd={
          referents.length < 2 && members.length > 1 ? addReferent : undefined
        }
        isLoading={isLoading}
        onClickMember={onClickMember}
      />
      <Spacer size="1.5rem" />
      {routes?.animationChangeRequest && (
        <a
          href={routes.animationChangeRequest}
          style={{ display: "flex", alignItems: "flex-start" }}
        >
          <FeatherIcon
            name="arrow-right"
            width="1rem"
            height="1rem"
            style={{ paddingTop: "3px" }}
          />
          <Spacer size="0.5rem" />
          {_("Changer l'animation du groupe")}
        </a>
      )}
      {routes?.animationChangeRequest && routes?.referentResignmentRequest && (
        <Spacer size="0.5rem" />
      )}
      {routes?.referentResignmentRequest && (
        <a
          href={routes.referentResignmentRequest}
          style={{ display: "flex", alignItems: "flex-start" }}
        >
          <FeatherIcon
            name="arrow-right"
            width="1rem"
            height="1rem"
            style={{ paddingTop: "3px" }}
          />
          <Spacer size="0.5rem" />
          {_("Je ne souhaite plus animer mon groupe")}
        </a>
      )}
      {(routes?.animationChangeRequest ||
        routes?.referentResignmentRequest) && <Spacer size="1.5rem" />}
      <StyledTitle>Gestionnaires</StyledTitle>
      <span style={{ color: style.black700 }}>
        {_("Ajoutez des gestionnaires pour vous assister sur Action Populaire.")}
      </span>
      <Spacer size="0.5rem" />
      <span style={{ color: style.black700 }}>
        {_("Ces derniers ont accès à la liste des membres, peuvent modifier les informations et créer des événements au nom du groupe.")}
      </span>
      <Spacer size="1.5rem" />
      <GroupMemberList
        members={managers}
        addButtonLabel="Ajouter un·e gestionnaire"
        onAdd={addManager}
        isLoading={isLoading}
        onClickMember={onClickMember}
      />
      {routes?.deleteGroup && (
        <>
          <hr />
          <a href={routes.deleteGroup} style={{ color: style.redNSP }}>
            {_("Supprimer le groupe")}
          </a>
        </>
      )}
    </>
  );
};

ReferentMainPanel.propTypes = {
  routes: PropTypes.object,
  addManager: PropTypes.func,
  addReferent: PropTypes.func,
  isLoading: PropTypes.bool,
  onClickMember: PropTypes.func,
  members: PropTypes.arrayOf(PropTypes.object),
};

export default ReferentMainPanel;
