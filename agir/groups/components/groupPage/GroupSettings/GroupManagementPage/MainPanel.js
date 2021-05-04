import PropTypes from "prop-types";
import React, { Fragment } from "react";

import GroupMember from "@agir/groups/groupPage/GroupSettings/GroupMember";
import AddPair from "@agir/groups/groupPage/GroupSettings/AddPair";
import HeaderPanel from "@agir/groups/groupPage/GroupSettings/HeaderPanel";
import Spacer from "@agir/front/genericComponents/Spacer.js";
import style from "@agir/front/genericComponents/_variables.scss";

import { StyledTitle } from "@agir/groups/groupPage/GroupSettings/styledComponents.js";

const [REFERENT, MANAGER /*, MEMBER */] = [100, 50, 10];

const MainPanel = (props) => {
  const {
    onBack,
    editManager,
    editReferent,
    illustration,
    members,
    is2022,
  } = props;

  return (
    <>
      <HeaderPanel onBack={onBack} illustration={illustration} />
      <StyledTitle>Animateurs et animatrices</StyledTitle>
      <Spacer size="0.5rem" />
      {members.map(
        (member) =>
          REFERENT === member.membershipType && (
            <Fragment key={member.id}>
              <GroupMember
                name={member?.displayName}
                image={member?.image}
                membershipType={member?.membershipType}
                email={member?.email}
                assets={member?.assets}
              />
              <Spacer size="1rem" />
            </Fragment>
          )
      )}
      {members.filter((member) => REFERENT === member.membershipType).length <
        2 && (
        <>
          <AddPair label="Ajouter votre binôme" onClick={editReferent} />
          <Spacer size="2rem" />
        </>
      )}
      <span>
        Les animateur·ices organisent la vie{" "}
        {is2022 ? "de l'équipe" : "du groupe"}. Pour respecter la charte des{" "}
        {is2022 ? "équipes de soutien" : "groupes d'action"}, votre{" "}
        {is2022 ? "équipe" : "groupe"} doit être animée à parité de genre.
      </span>
      <Spacer size="1rem" />
      <StyledTitle>Gestionnaires</StyledTitle>
      <span>
        Ajoutez des gestionnaires pour vous assiter sur la gestion{" "}
        {is2022 ? "de l'équipe" : "du groupe"} au quotidien sur la plate-forme.
        Ces derniers ont accès à la liste des membres, peuvent modifier les
        informations {is2022 ? "de l'équipe" : "du groupe"}, et créer des
        événements au nom {is2022 ? "de l'équipe" : "du groupe"}.
      </span>
      <Spacer size="1rem" />
      {members.map(
        (member) =>
          MANAGER === member.membershipType && (
            <Fragment key={member.id}>
              <GroupMember
                name={member?.displayName}
                image={member?.image}
                membershipType={member?.membershipType}
                email={member?.email}
                assets={member?.assets}
              />
              <Spacer size="1rem" />
            </Fragment>
          )
      )}
      <AddPair label="Ajouter un·e gestionnaire" onClick={editManager} />
      <hr />
      <a href="https://actionpopulaire.fr/formulaires/demande-changement-animation-ga/">
        Changer l’animation {is2022 ? "de l'équipe" : "du groupe"}
      </a>
      <Spacer size="0.5rem" />
      <a href="https://infos.actionpopulaire.fr/contact/">
        Je ne souhaite plus être animateur ou animatrice
      </a>
      <Spacer size="0.5rem" />
      <a
        href="https://agir.lafranceinsoumise.fr/formulaires/demande-suppression-ga/"
        style={{ color: style.redNSP }}
      >
        Supprimer {is2022 ? "l'équipe" : "le groupe"}
      </a>
    </>
  );
};

MainPanel.propTypes = {
  onBack: PropTypes.func,
  illustration: PropTypes.string,
  members: PropTypes.arrayOf(PropTypes.object),
  editManager: PropTypes.func,
  editReferent: PropTypes.func,
  is2022: PropTypes.bool,
};

export default MainPanel;
