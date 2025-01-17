import _ from "gettext";
import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";
import styled from "styled-components";

import Button from "@agir/front/genericComponents/Button";
import CheckboxField from "@agir/front/formComponents/CheckboxField";
import Link from "@agir/front/app/Link";
import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";
import Spacer from "@agir/front/genericComponents/Spacer";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents";

const StyledWarning = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.black700};
  background-color: ${(props) => props.theme.secondary100};
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;

  strong {
    font-weight: 600;
  }

  small {
    font-size: 0.875rem;
  }
`;

const StyledContent = styled.article`
  color: ${(props) => props.theme.black700};

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-flow: column nowrap;
    gap: 1.25rem;

    li {
      display: flex;
      flex-flow: row nowrap;
      align-items: flex-start;
      gap: 1rem;
      font-size: 1rem;

      ${RawFeatherIcon} {
        flex: 0 0 2rem;
        color: white;
        border-radius: 100%;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      strong {
        font-weight: 600;
        color: ${(props) => props.theme.black1000};
      }
    }
  }

  footer {
    width: 100%;
    text-align: center;
    font-size: 0.875rem;

    ${Button} {
      &[disabled] {
        opacity: 0.3;
      }
    }
  }
`;

const MissingCriteriaWarning = () => (
  <StyledWarning>
    <strong>
      {_("Action requise&nbsp;: votre groupe ne respecte plus la charte des groupes d'action&nbsp;!")}
    </strong>
    <br />
    {_("Certains des critères requis pour la certification de votre groupe ne sont plus respectés. Attention, si cette situation devait perdurer, votre groupe serait decertifié.")}
    <br />
    <small>
      {_("NB&nbsp;: dans le cas de l'animation paritaire il se peut que les animateur-ices n'aient pas indiqué leur genre. Corrigez cela pour que votre groupe redevienne paritaire.")}
    </small>
  </StyledWarning>
);

const GroupCertification = (props) => {
  const { routes, isCertified, certificationCriteria = {} } = props;

  const [hasConsent, setHasConsent] = useState(false);

  const toggleConsent = (e) => {
    setHasConsent(e.target.checked);
  };

  const [criteria, checkedCriteria, isCertifiable] = useMemo(() => {
    const criteria = Object.values(certificationCriteria);
    const checked = criteria.filter((criterion) => criterion.value);
    return [criteria, checked, checked.length === criteria.length];
  }, [certificationCriteria]);

  return (
    <>
      <StyledTitle>{"Certificación del grupo"}</StyledTitle>
      <Spacer size="0.5rem" />
      <StyledContent>
        <p>{"La certificación del grupo da más valor a tu grupo. "}</p>
        <p>
          {"Un grupo certificado respeta plenamente"}{" "}
          <Link route="info.claudializate.com/principios">{"los principios de grupos"}</Link>.
        </p>
        {isCertified && !isCertifiable && <MissingCriteriaWarning />}
        <Spacer size="1rem" />
        <ul>
          {criteria.map(({ value, label, description }) => (
            <li key={label}>
              <RawFeatherIcon
                name={value ? "check" : "chevron-right"}
                css={`
                  background-color: ${({ name, theme }) =>
                    name === "check" ? theme.green500 : theme.black500};
                `}
              />
              <span>
                <strong>{label || key}</strong>
                <br />
                {description}
              </span>
            </li>
          ))}
          {isCertified && (
            <li key="certified">
              <RawFeatherIcon
                name="check"
                css={`
                  background-color: ${({ theme }) => theme.green500};
                `}
              />
              <span>
                <strong>{_("Votre groupe est certifié&nbsp;!")}</strong>
              </span>
            </li>
          )}
        </ul>
        <Spacer size="2rem" />
        {!isCertified && routes?.certificationRequest && (
          <footer>
            {isCertifiable && (
              <>
                <CheckboxField
                  required
                  value={hasConsent}
                  onChange={toggleConsent}
                  css={`
                    text-align: left;
                    padding: 0 0.5rem;

                    && > span {
                      color: ${({ theme }) => theme.black700};
                    }
                  `}
                  label={
                    <>
                      {_("Je confirme avoir pris connaissance de la")}{" "}
                      <Link route="charteEquipes">
                        {"los principios de grupos"}
                      </Link>{" "}
                      {_("et m'engage à la respecter dans l'animation de mon groupe")}
                    </>
                  }
                />
                <Spacer size="1rem" />
              </>
            )}
            <Button
              link
              color="primary"
              href={
                isCertifiable && hasConsent ? routes.certificationRequest : "#"
              }
              disabled={!hasConsent || !isCertifiable}
            >
              {"Solicitar certificación"}
            </Button>
            <Spacer size="1rem" />
            <span>
              {checkedCriteria.length === 0
                ? "Aucune"
                : `${checkedCriteria.length}/${criteria.length}`}{" "}
              {checkedCriteria.length <= 1
                ? "requisito cumplido"
                : "requisitos cumplidos"}{" "}
              {"para solicitar la certificación"}
            </span>
          </footer>
        )}
      </StyledContent>
    </>
  );
};
GroupCertification.propTypes = {
  routes: PropTypes.shape({
    certificationRequest: PropTypes.string,
  }),
  isCertified: PropTypes.bool,
  certificationCriteria: PropTypes.shape({
    gender: PropTypes.object,
    activity: PropTypes.object,
    members: PropTypes.object,
    creation: PropTypes.object,
  }),
};
export default GroupCertification;
