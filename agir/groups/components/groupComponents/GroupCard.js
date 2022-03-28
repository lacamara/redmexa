import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { routeConfig } from "@agir/front/app/routes.config";
import style from "@agir/front/genericComponents/_variables.scss";
import { parseDiscountCodes } from "@agir/groups/groupPage/utils";

import Button from "@agir/front/genericComponents/Button";
import Card from "@agir/front/genericComponents/Card";
import Collapsible from "@agir/front/genericComponents/Collapsible.js";
import { Column, Hide, Row } from "@agir/front/genericComponents/grid";
import FeatherIcon from "@agir/front/genericComponents/FeatherIcon";
import Link from "@agir/front/app/Link";
import ShareLink from "@agir/front/genericComponents/ShareLink";

const GroupIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  margin: 0;
  padding: 0;
  border-radius: 100%;
  background-color: ${(props) => props.theme.black50};
  color: ${(props) => props.theme.black1000};
`;

const Label = styled.span`
  font-size: 13px;
  display: inline-block;
  padding: 6px 10px;
  border: 1px solid #dfdfdf;
  margin-right: 8px;
  margin-bottom: 4px;
  line-height: 16px;
  border-radius: 20px;
  ${({ main }) =>
    main
      ? `
    background: #EEEEEE;
    border: 0;
    `
      : ""}
`;

const DiscountCodesSection = styled.section`
  margin: 1.5rem 0 0;

  & > * {
    color: ${style.black1000};
    margin: 0.5rem 0;
  }

  & > p {
    background-color: ${style.primary100};
    border-radius: ${style.borderRadius};
    font-size: 0.875rem;
    padding: 0.875rem;
    line-height: 1.5;
    margin: 0 0 1rem;
  }

  ul {
    padding: 0;
  }

  li {
    list-style: none;
  }

  li span {
    font-weight: 400;
  }
`;

const StyledRow = styled(Row)`
  ${Button} {
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
  }
`;

const GroupCard = ({
  id,
  name,
  description,
  eventCount,
  membersCount,
  isMember,
  isManager,
  typeLabel,
  labels,
  discountCodes,
  displayGroupLogo,
  displayType,
  displayDescription,
  displayMembership,
  isEmbedded = false,
  isCertified,
}) => {
  const history = useHistory();

  const handleClick = useCallback(
    (e) => {
      if (["A", "INPUT", "BUTTON"].includes(e.target.tagName.toUpperCase())) {
        return;
      }
      id &&
        routeConfig.groupDetails &&
        history.push(routeConfig.groupDetails.getLink({ groupPk: id }));
    },
    [history, id]
  );
  const parsedDiscountCodes = useMemo(
    () => parseDiscountCodes(discountCodes),
    [discountCodes]
  );

  return (
    <Card onClick={isEmbedded ? undefined : handleClick}>
      <Row gutter={6}>
        {displayGroupLogo && (
          <Column collapse={0}>
            <Link
              aria-label={name}
              to={routeConfig.groupDetails.getLink({ groupPk: id })}
            >
              <GroupIcon>
                <FeatherIcon name="users" />
              </GroupIcon>
            </Link>
          </Column>
        )}
        <Column collapse={0} grow>
          <h3 style={{ marginTop: 2, marginBottom: 2 }}>
            <Link
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
              to={routeConfig.groupDetails.getLink({ groupPk: id })}
            >
              {name}
            </Link>
          </h3>
          <small style={{ color: style.black500 }}>
            {eventCount} événement{eventCount > 1 ? "s" : ""} &bull;{" "}
            {membersCount} membre{membersCount > 1 ? "s" : ""}
          </small>
        </Column>
      </Row>

      {displayType && typeLabel && (
        <div style={{ marginTop: "1rem" }}>
          <Label main>{typeLabel}</Label>
          {labels &&
            labels.map((label, index) => <Label key={index}>{label}</Label>)}
        </div>
      )}

      {displayDescription && description && (
        <div style={{ marginTop: "1rem" }}>
          <Collapsible
            maxHeight={100}
            expanderLabel="Lire la suite"
            dangerouslySetInnerHTML={{ __html: description }}
            fadingOverflow
          />
        </div>
      )}

      {parsedDiscountCodes && parsedDiscountCodes.length > 0 && (
        <DiscountCodesSection>
          <h5>Codes matériels</h5>
          <p>
            <strong>Campagne présidentielle&nbsp;:</strong> exceptionnellement,
            vos codes promo d'avril sont disponibles dès aujourd'hui.
            <br />
            Commandez votre matériel pour la dernière ligne droite
            maintenant&nbsp;!
          </p>
          <ul>
            {parsedDiscountCodes.map(({ code, date }) => (
              <li key={code}>
                <ShareLink
                  color="secondary"
                  url={code}
                  label="Copier"
                  $wrap={400}
                />
                <p style={{ fontSize: "0.875rem", paddingTop: ".25rem" }}>
                  Expiration&nbsp;: {date}
                </p>
              </li>
            ))}
          </ul>
        </DiscountCodesSection>
      )}

      <StyledRow gutter={6} style={{ paddingTop: ".5rem" }}>
        {!isEmbedded && !isMember && (
          <Button
            key="join"
            color="primary"
            link
            to={routeConfig.groupDetails.getLink({ groupPk: id })}
          >
            Rejoindre
            <Hide as="span" under={800}>
              &nbsp;le groupe
            </Hide>
          </Button>
        )}
        <Button
          link
          key="browse"
          color="default"
          to={routeConfig.groupDetails.getLink({ groupPk: id })}
        >
          Voir le groupe
        </Button>
        {isCertified && (
          <Button
            link
            key="fund"
            icon="fast-forward"
            route="donations"
            params={{ group: id }}
          >
            Financer
          </Button>
        )}
        {isManager && (
          <Button
            key="manage"
            link
            to={routeConfig.groupSettings.getLink({ groupPk: id })}
            icon="settings"
          >
            Gestion
          </Button>
        )}
      </StyledRow>

      {displayMembership && isMember && (
        <div style={{ marginTop: "1em" }}>
          <FeatherIcon small inline name="check" /> Vous êtes membre du groupe
        </div>
      )}
    </Card>
  );
};

GroupCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  eventCount: PropTypes.number,
  membersCount: PropTypes.number,
  isMember: PropTypes.bool,
  isManager: PropTypes.bool,
  typeLabel: PropTypes.string,
  labels: PropTypes.arrayOf(PropTypes.string),
  routes: PropTypes.object,
  displayGroupLogo: PropTypes.bool,
  displayType: PropTypes.bool,
  displayDescription: PropTypes.bool,
  displayMembership: PropTypes.bool,
  ...DiscountCodesSection.propTypes,
  isEmbedded: PropTypes.bool,
};

GroupCard.defaultProps = {
  displayGroupLogo: true,
  displayType: true,
  displayDescription: true,
  displayMembership: true,
  isManager: false,
};

export default GroupCard;
