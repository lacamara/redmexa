import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import Button from "@agir/front/genericComponents/Button";
import Modal from "@agir/front/genericComponents/Modal";
import Spacer from "@agir/front/genericComponents/Spacer";

import { routeConfig } from "@agir/front/app/routes.config";

const ANONYMOUS_TO_SOFT_LOGIN_CONNECTION = "ANONYMOUS_TO_SOFT_LOGIN_CONNECTION";
const LOGGED_IN_TO_SOFT_LOGIN_CONNECTION = "LOGGED_IN_TO_SOFT_LOGIN_CONNECTION";
export const SOFT_LOGIN_MODAL_TAGS = [
  ANONYMOUS_TO_SOFT_LOGIN_CONNECTION,
  LOGGED_IN_TO_SOFT_LOGIN_CONNECTION,
];

const StyledModalContent = styled.div`
  max-width: 415px;
  padding: 1rem;
  margin: 40px auto 0;
  border-radius: ${(props) => props.theme.borderRadius};
  box-shadow: ${(props) => props.theme.elaborateShadow};
  background-color: ${(props) => props.theme.white};

  @media (max-width: ${(props) => props.theme.collapse}px) {
    margin-top: 1rem;
    min-height: 0;
    max-width: calc(100% - 2rem);
  }

  h3,
  h6 {
    text-align: center;
    line-height: 1.5;
    margin: 0;
  }

  h3 {
    font-weight: 600;
    font-size: 1.25rem;
  }

  h6 {
    color: ${(props) => props.theme.primary500};
    font-weight: 400;
    font-size: 0.875rem;
  }
  p {
    line-height: 1.5;

    strong {
      font-weight: 600;
    }

    em {
      color: ${(props) => props.theme.black500};
    }
  }

  footer {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    gap: 0.5rem;

    ${Button} {
      flex: 1 1 auto;
    }
  }
`;

const SoftLoginModalContent = (props) => {
  const { user, data, onClose } = props;

  if (!user?.displayName || !data) {
    return null;
  }

  const username =
    user.displayName?.length > 2
      ? user.displayName
      : user.firstName || user.displayName;

  const [type, softLoginUserName, softLoginUserEmail, softLoginURL] =
    data.tags.split(",");

  if (type === ANONYMOUS_TO_SOFT_LOGIN_CONNECTION) {
    return (
      <StyledModalContent>
        <h3>{_("Bonjour")} {username}</h3>
        <h6>{user.email}</h6>
        <Spacer size="0.625rem" />
        <p>{"¿Sí eres "} {username}&nbsp;?</p>
        <p>
          {"Te conectaste automáticamente siguiendo un enlace "}
          {"enviado por email."}
        </p>
        <Spacer size=".5rem" />
        <div>
          <Button wrap block onClick={onClose} color="primary">
            {_("Je suis")} {username}
          </Button>
          <Spacer size="0.5rem" />
          <Button block link href={routeConfig.logout.getLink()}>
            {_("Ce n'est pas moi")}
          </Button>
        </div>
      </StyledModalContent>
    );
  }

  if (type === LOGGED_IN_TO_SOFT_LOGIN_CONNECTION) {
    return (
      <StyledModalContent>
        <h3>Confirma tu identidad</h3>
        <Spacer size="0.625rem" />
        <p>
          <strong>Estás conectad@ como:</strong>
          <br />
          {username} <em>({user.email})</em>
        </p>
        <p>
          <strong>El enlace que utilizaste busca conectarte a la cuenta de: </strong>
          <br />
          {softLoginUserName} <em>({softLoginUserEmail})</em>
        </p>
        <p>Confirma tu identidad :</p>
        <Spacer size=".5rem" />
        <footer>
          <Button wrap onClick={onClose}>
            {_("Je suis")} {username}
          </Button>
          <Button wrap link href={softLoginURL}>
            {_("Je suis")} {softLoginUserName}
          </Button>
        </footer>
      </StyledModalContent>
    );
  }

  return null;
};

export const SoftLoginModal = (props) => (
  <Modal shouldShow={props.shouldShow} noScroll>
    {props.shouldShow && <SoftLoginModalContent {...props} />}
  </Modal>
);

SoftLoginModalContent.propTypes = SoftLoginModal.propTypes = {
  data: PropTypes.shape({
    tags: PropTypes.string.isRequired,
  }),
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    email: PropTypes.string.isRequired,
  }).isRequired,
  shouldShow: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SoftLoginModal;
