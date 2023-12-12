import _ from "gettext";
import { DateTime } from "luxon";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import Collapsible from "@agir/front/genericComponents/Collapsible";
import Button from "@agir/front/genericComponents/Button";
import Card from "@agir/front/genericComponents/Card";
import Spacer from "@agir/front/genericComponents/Spacer";
import StyledCard from "./StyledCard";
import style from "@agir/front/genericComponents/_variables.scss";

import { routeConfig } from "@agir/front/app/routes.config";

const EventReportCard = ({
  id,
  compteRendu,
  isOrganizer,
  isEditable,
  endTime,
}) => {
  if (!compteRendu && !isOrganizer) {
    return null;
  }

  return (
    <StyledCard>
      <h5>{_("Compte rendu")}</h5>
      <Spacer size="0.5rem" />
      {compteRendu ? (
        <Collapsible
          dangerouslySetInnerHTML={{ __html: compteRendu }}
          style={{ margin: "1em 0 3em" }}
          fadingOverflow
        />
      ) : (
        <p>{"Aún no hay resumen de esta acción"}</p>
      )}
      {isEditable && isOrganizer && (
        <Button
          style={{ marginTop: "1rem" }}
          link
          to={routeConfig.eventSettings.getLink({
            eventPk: id,
            activePanel: "compte-rendu",
          })}
        >
          {compteRendu ? _("Modifier le") : _("Ajouter un")} {_("compte rendu")}
        </Button>
      )}
    </StyledCard>
  );
};

EventReportCard.propTypes = {
  id: PropTypes.string,
  compteRendu: PropTypes.string,
  isEditable: PropTypes.bool,
  isOrganizer: PropTypes.bool,
  endTime: PropTypes.object,
};
export default EventReportCard;
