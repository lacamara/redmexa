import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";
import useSWR from "swr";

import * as api from "@agir/events/common/api";

import Button from "@agir/front/genericComponents/Button";
import Spacer from "@agir/front/genericComponents/Spacer";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents";
import HeaderPanel from "@agir/front/genericComponents/ObjectManagement/HeaderPanel";
import { useToast } from "@agir/front/globalContext/hooks";
import { routeConfig } from "@agir/front/app/routes.config";
import { useHistory } from "react-router-dom";

const EventCancelation = (props) => {
  const { onBack, illustration, eventPk } = props;

  const history = useHistory();
  const sendToast = useToast();
  const { data: event } = useSWR(api.getEventEndpoint("getEvent", { eventPk }));

  const handleCancel = async () => {
    const { data, error } = await api.cancelEvent(eventPk);

    if (error) {
      sendToast(
        error.detail || _("Une erreur est survenue, veuillez réessayer plus tard"),
        "ERROR",
        { autoClose: true },
      );
      return;
    }
    sendToast(_("L'événement a bien été annulé."), "SUCCESS", { autoClose: true });
    const route = routeConfig.events.getLink();
    history.push(route);
  };

  return (
    <>
      <HeaderPanel onBack={onBack} illustration={illustration} />
      <StyledTitle>{_("Annuler l'événement")}</StyledTitle>

      <Spacer size="1rem" />

      <p>
        {_("Voulez-vous annuler votre événement")} <strong>{event.name}</strong> ?
      </p>
      <p>
        {_("Tous les participant·es recevront une notification leur indiquant que vous avez annulé l’événement.")}
      </p>
      <p>{_("Cette action est irréversible.")}</p>

      <Spacer size="1rem" />
      <Button onClick={handleCancel} color="danger">
        {_("Annuler l'événement")}
      </Button>
    </>
  );
};
EventCancelation.propTypes = {
  onBack: PropTypes.func,
  illustration: PropTypes.string,
  eventPk: PropTypes.string,
};
export default EventCancelation;
