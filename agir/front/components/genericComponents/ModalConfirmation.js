import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import Button from "@agir/front/genericComponents/Button";
import Spacer from "@agir/front/genericComponents/Spacer";
import { ResponsiveLayout } from "@agir/front/genericComponents/grid";

import BottomSheet from "@agir/front/genericComponents/BottomSheet";
import Modal from "@agir/front/genericComponents/Modal";
import style from "@agir/front/genericComponents/_variables.scss";

const ModalContainer = styled.div`
  background: white;
  width: 40%;
  max-width: 500px;
  margin: 5% auto;
  border-radius: ${style.borderRadius};
  display: flex;
  justify-content: center;

  @media (max-width: ${style.collapse}px) {
    width: 100%;
    max-width: unset;
    margin: 0;
  }
`;

const ModalContent = styled.div`
  display: inline-flex;
  flex-direction: column;
  padding: 1rem;

  h3 {
    font-size: 1rem;
  }

  > ${Button} {
    margin-bottom: 1rem;
    color: white;
  }
`;

const ModalConfirmation = (props) => {
  const {
    shouldShow = false,
    onClose,
    title,
    children,
    dismissLabel,
    confirmationLabel = "",
    confirmationUrl = "",
    onConfirm = null,
    shouldDismissOnClick = true,
  } = props;

  return (
    <ResponsiveLayout
      DesktopLayout={Modal}
      MobileLayout={BottomSheet}
      shouldShow={shouldShow}
      isOpen={shouldShow}
      onClose={onClose}
      onDismiss={onClose}
      shouldDismissOnClick={shouldDismissOnClick}
      noScroll
    >
      <ModalContainer>
        <ModalContent>
          <h3>{title}</h3>
          {children}
          <Spacer size="1rem" />
          {!!confirmationUrl && (
            <Button
              style={{ backgroundColor: style.primary500 }}
              type="button"
              link
              route={confirmationUrl}
            >
              {confirmationLabel}
            </Button>
          )}
          {!!onConfirm && (
            <Button
              style={{ backgroundColor: style.primary500 }}
              type="button"
              onClick={onConfirm}
            >
              {confirmationLabel}
            </Button>
          )}
          {dismissLabel && (
            <Button
              type="button"
              onClick={onClose}
              style={{ color: style.black1000 }}
            >
              {dismissLabel}
            </Button>
          )}
        </ModalContent>
      </ModalContainer>
    </ResponsiveLayout>
  );
};

ModalConfirmation.propTypes = {
  shouldShow: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.node,
  children: PropTypes.node,
  dismissLabel: PropTypes.node,
  confirmationLabel: PropTypes.node,
  confirmationUrl: PropTypes.string,
  shouldDismissOnClick: PropTypes.bool,
};

export default ModalConfirmation;
