import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";

import style from "@agir/front/genericComponents/_variables.scss";

import FileCard from "@agir/front/genericComponents/FileCard";
import HelpCenterCard from "@agir/front/genericComponents/HelpCenterCard";
import HeaderPanel from "@agir/front/genericComponents/ObjectManagement/HeaderPanel";
import Spacer from "@agir/front/genericComponents/Spacer";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents";

const GroupHelpPage = (props) => {
  const { onBack, illustration } = props;

  return (
    <div>
      <HeaderPanel onBack={onBack} illustration={illustration} />
      <StyledTitle>{_("Ressources")}</StyledTitle>
      <Spacer size="1rem" />
      <span style={{ color: style.black700 }}>
        {_("Retrouvez ici la liste des ressources qui pourront vous être utiles pour l'animation et la gestion de votre groupe.")}
      </span>
      <Spacer size="1rem" />
      <StyledTitle>{_("Centre d'aide")}</StyledTitle>
      <Spacer size=".5rem" />
      <HelpCenterCard type="group" />
      <Spacer size="1rem" />
      <StyledTitle>{_("Documents")}</StyledTitle>
      <Spacer size=".5rem" />
      <FileCard
        title={_("Attestation d'assurance de la France insoumise")}
        text={_("Document utile en cas de réservation d'une salle pour les événements publics")}
        icon="file-text"
        route="attestationAssurance"
        downloadLabel="Télécharger l'attestation"
      />
      <Spacer size="1rem" />
      <FileCard
        title={_("Charte des groupes d'action")}
        text={_("La charte que tous les animateurs et toutes les animatrices de groupe s’engagent à respecter.")}
        icon="file-text"
        route="charteEquipes"
        downloadLabel="Voir la charte"
        downloadIcon="eye"
      />
      <Spacer size="1rem" />
      <FileCard
        title={_("Livret de l’animateur·rice")}
        text={_("Un guide pratique qui répond à la plupart des intérrogations concernant l'animation d'un groupe d'action.")}
        icon="file-text"
        route="livretAnimateurice"
        downloadLabel="Télécharger le livret"
      />
      <Spacer size="2rem" />
    </div>
  );
};
GroupHelpPage.propTypes = {
  onBack: PropTypes.func,
  illustration: PropTypes.string,
};
export default GroupHelpPage;
