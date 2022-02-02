import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";

import style from "@agir/front/genericComponents/_variables.scss";

import BottomSheet from "@agir/front/genericComponents/BottomSheet";
import ListUsers from "@agir/msgs/MessagePage/ListUsers";
import ModalConfirmation from "@agir/front/genericComponents/ModalConfirmation";
import { ResponsiveLayout } from "@agir/front/genericComponents/grid";

import { getGroupEndpoint } from "@agir/groups/api.js";
import { MANUAL_REVALIDATION_SWR_CONFIG } from "@agir/front/allPages/SWRContext";

const Description = styled.span`
  font-size: 14px;
  cursor: pointer;

  @media (max-width: ${style.collapse}px) {
    font-size: 12px;
  }
`;

const PrimarySpan = styled.span`
  color: ${style.primary500};
`;

const MessageDetails = ({ message }) => {
  const [openParticipants, setOpenParticipants] = useState(false);

  const { data: participants } = useSWR(
    getGroupEndpoint("messageParticipants", { messagePk: message?.id }),
    MANUAL_REVALIDATION_SWR_CONFIG
  );

  const closeParticipants = useCallback(() => {
    setOpenParticipants(false);
  }, []);

  if (!participants) {
    return null;
  }

  return (
    <>
      <Description onClick={() => setOpenParticipants(true)}>
        <PrimarySpan>{participants.total} personnes</PrimarySpan> - Membres de{" "}
        <PrimarySpan>{message?.group?.name}</PrimarySpan>
      </Description>

      <ResponsiveLayout
        DesktopLayout={ModalConfirmation}
        MobileLayout={BottomSheet}
        isOpen={openParticipants}
        shouldShow={openParticipants}
        onDismiss={closeParticipants}
        onClose={closeParticipants}
        shouldDismissOnClick
      >
        <ListUsers message={message} participants={participants} />
      </ResponsiveLayout>
    </>
  );
};

export default MessageDetails;
