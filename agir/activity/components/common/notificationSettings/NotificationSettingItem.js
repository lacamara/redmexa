import PropTypes from "prop-types";
import React, { memo, useCallback } from "react";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";

const StyledButton = styled.button`
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid;
  background-color: ${({ $active }) =>
    $active ? style.green200 : "transparent"};
  color: ${({ $active }) => ($active ? style.black1000 : style.black500)};
  border-color: ${({ $active }) => ($active ? style.green200 : style.black100)};
  visibility: ${({ $hidden }) => ($hidden ? "hidden" : "visible")};

  &:focus {
    outline: none;
    box-shadow: ${({ $disabled }) =>
      !$disabled ? `0 0 0 4px ${style.black100}` : "none"};
  }

  &[disabled] {
    opacity: 0.5;

    &:focus {
      box-shadow: none;
    }
  }
`;
const StyledItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 70px auto;
  grid-gap: 0 0.5rem;
  justify-items: flex-end;
  align-items: start;
  font-size: 0.875rem;
  line-height: 1.5;

  & > :first-child {
    width: 100%;
  }
`;

const NotificationSettingItem = (props) => {
  const { notification, email, push, onChange, disabled } = props;

  const togglePush = useCallback(() => {
    onChange({
      ...notification,
      type: "push",
      action: push ? "remove" : "add",
      subscriptionIds: push,
    });
  }, [push, notification, onChange]);

  const toggleEmail = useCallback(() => {
    onChange({
      ...notification,
      type: "email",
      action: email ? "remove" : "add",
      subscriptionIds: email,
    });
  }, [email, notification, onChange]);

  return (
    <StyledItem>
      <span>{notification.label}</span>
      <StyledButton
        $active={push}
        $hidden={notification.hasPush === false}
        aria-label={
          push ? "Désactiver la notification" : "Activer la notification"
        }
        onClick={togglePush}
        disabled={notification.hasPush === false || disabled}
      >
        <RawFeatherIcon width="1.25rem" height="1.25rem" name="bell" />
      </StyledButton>
      <StyledButton
        $active={email}
        $hidden={notification.hasEmail === false}
        aria-label={push ? "Désactiver l'e-mail" : "Activer l'e-mail"}
        onClick={toggleEmail}
        disabled={notification.hasEmail === false || disabled}
      >
        <RawFeatherIcon width="1.25rem" height="1.25rem" name="mail" />
      </StyledButton>
    </StyledItem>
  );
};
NotificationSettingItem.propTypes = {
  notification: PropTypes.shape({
    label: PropTypes.string.isRequired,
    hasEmail: PropTypes.bool,
    hasPush: PropTypes.bool,
  }).isRequired,
  push: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.bool,
  ]),
  email: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.bool,
  ]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default memo(NotificationSettingItem);
