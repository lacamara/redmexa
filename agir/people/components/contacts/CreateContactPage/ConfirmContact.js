import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import Button from "@agir/front/genericComponents/Button";
import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";
import Spacer from "@agir/front/genericComponents/Spacer";
import {
  LIAISON_NEWSLETTER,
  NEWSLETTERS,
} from "@agir/front/authentication/common";

const StyledWrapper = styled.div`
  h2 {
    font-size: 1.625rem;
    font-weight: 700;
    margin-bottom: 1.5rem;

    @media (max-width: ${style.collapse}px) {
      font-size: 1.25rem;
    }
  }

  h4,
  p,
  ul {
    padding: 0;
    margin: 0;
  }

  ul {
    padding-left: 1rem;

    li + li {
      margin-top: 0.25rem;
    }
  }

  footer {
    line-height: 0;
    @media (max-width: ${style.collapse}px) {
      display: flex;
      flex-flow: column-reverse nowrap;

      ${Button} {
        width: 100%;
      }
    }
  }
`;

const ConfirmContact = (props) => {
  const { data, onBack, onConfirm, isLoading } = props;
  const newsletters = [
    ...data.newsletters.map(
      (n) => NEWSLETTERS[n]?.visible && NEWSLETTERS[n].label,
    ),
    data.group?.id &&
      data.hasGroupNotifications &&
      "Notificaciones del grupo",
  ].filter(Boolean);

  return (
    <StyledWrapper>
      <h2>{_("Confirmer les informations")}</h2>
      <div>
        <h4>
          {data.firstName} {data.lastName}
        </h4>
        <p>{data.phone}</p>
        {data.address ? <p>{data.address}</p> : null}
        <p>{`${data.zip} ${data.city || ""} ${data.country || ""}`.trim()}</p>
        <p style={{ color: style.primary500 }}>{data.email}</p>
      </div>
      <Spacer size="1.5rem" />
      <ul>
        {data.isPoliticalSupport ? (
          <li> Quiere unirse a Claudialízate</li>
        ) : null}
        {newsletters.length > 0 ? (
          <li>
            Recibirá también la información siguiente &nbsp;:"{" "}
            <ul>
              {newsletters.map((n) => (
                <li key={n} style={{ fontSize: "0.875rem" }}>
                  {n}
                </li>
              ))}
            </ul>
          </li>
        ) : null}
        {data.newsletters.includes(LIAISON_NEWSLETTER.value) ? (
          <li>{_("Sera correspondant·e de l’immeuble ou de village")}</li>
        ) : null}
        {data.group?.id ? (
          <li>
           Esta información será accesible a gestores y facilitadores del grupo <strong>{data.group.name}</strong>
          </li>
        ) : null}
      </ul>
      <Spacer size="2rem" />
      <p>La persona recibirá un email para confirmar sus datos.</p>
      <Spacer size="0.5rem" />
      <p>
      Ojo: es importante asegurarte de que la persona está de acuerdo antes de agregarla. 
      </p>
      <Spacer size="1rem" />
      <footer>
        <Button icon="arrow-left" onClick={onBack} disabled={isLoading}>
          Modificar
        </Button>
        <Spacer style={{ display: "inline-block" }} size="1rem" />
        <Button color="secondary" onClick={onConfirm} disabled={isLoading}>
          {/*_("Enregistrer le contact")*/} Guardar el contacto
        </Button>
      </footer>
    </StyledWrapper>
  );
};

ConfirmContact.propTypes = {
  data: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
    phone: PropTypes.string,
    email: PropTypes.string.isRequired,
    isPoliticalSupport: PropTypes.bool.isRequired,
    newsletters: PropTypes.arrayOf(PropTypes.string).isRequired,
    group: PropTypes.object,
    hasGroupNotifications: PropTypes.bool,
    address: PropTypes.string,
    city: PropTypes.string,
  }),
  onBack: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
export default ConfirmContact;
