import _ from "gettext";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { mutate } from "swr";

import styled from "styled-components";
import style from "@agir/front/genericComponents/_variables.scss";
import * as api from "@agir/events/common/api";

import Spacer from "@agir/front/genericComponents/Spacer.js";
import SelectField from "@agir/front/formComponents/SelectField";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents.js";
import MemberList from "../EventMemberList";
import BackButton from "@agir/front/genericComponents/ObjectManagement/BackButton.js";
import Button from "@agir/front/genericComponents/Button";
import { useToast } from "@agir/front/globalContext/hooks.js";

const StyledList = styled.div`
  display: flex;
  align-items: center;
  div {
    display: inline-flex;
    width: 0.5rem;
    height: 0.5rem;
    background-color: ${style.primary500};
    border-radius: 2rem;
    margin-right: 0.5rem;
  }
`;

export const AddOrganizer = ({ eventPk, participants, onBack }) => {
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const sendToast = useToast();

  const onSubmit = async () => {
    setIsLoading(true);
    const res = await api.addOrganizer(eventPk, {
      organizer_id: selectedParticipant.value.id,
    });
    setIsLoading(false);
    if (res.errors) {
      sendToast(
        res.errors?.detail || _("L'invitation n'a pas pu être envoyée"),
        "ERROR",
        { autoClose: true },
      );
      onBack();
      return;
    }
    sendToast("Información actualizada", "SUCCESS", { autoClose: true });
    mutate(api.getEventEndpoint("getDetailAdvanced", { eventPk }));
    onBack();
  };

  return (
    <>
      <BackButton onClick={onBack} />
      <StyledTitle>{_("Ajouter un·e autre organisateur·ice")}</StyledTitle>
      <Spacer size="1rem" />

      {!participants.length ? (
        <span style={{ color: style.black700 }}>
          {
            "Debes tener más participantes inscritos en la acción para poder darles el rol de co-organizadores."
          }
        </span>
      ) : (
        <SelectField
          label={"Escoge un participante"}
          placeholder={_("Sélection")}
          options={participants.map((participant) => ({
            label: `${participant.displayName} (${participant.email})`,
            value: participant,
          }))}
          onChange={setSelectedParticipant}
          value={selectedParticipant}
        />
      )}

      {selectedParticipant && (
        <>
          <Spacer size="1rem" />
          <MemberList members={[selectedParticipant.value]} />
          <Spacer size="1rem" />
          <div>
            {"Tod@ organizador(a) puede :"}
            <Spacer size="0.5rem" />
            <StyledList>
              <div />
              {_("Voir la liste des participant·es")}
            </StyledList>
            <StyledList>
              <div />
              {_("Modifier les organisateurs")}
            </StyledList>
            <StyledList>
              <div />
              {_("Modifier les informations de l’événement")}
            </StyledList>
            <StyledList>
              <div />
              {"Cancelar la acción"}
            </StyledList>
          </div>
          <Spacer size="1rem" />
          <Button color="secondary" onClick={onSubmit} disabled={isLoading}>
            {_("Confirmer")}
          </Button>
        </>
      )}
    </>
  );
};
AddOrganizer.propTypes = {
  onBack: PropTypes.func,
  participants: PropTypes.arrayOf(PropTypes.object),
  eventPk: PropTypes.string,
};

export default AddOrganizer;
