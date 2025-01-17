import _ from "gettext";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { routeConfig } from "@agir/front/app/routes.config";
import style from "@agir/front/genericComponents/_variables.scss";

import Link from "@agir/front/app/Link";
import Button from "@agir/front/genericComponents/Button";
import Card from "@agir/front/genericComponents/Card";
import Collapsible from "@agir/front/genericComponents/Collapsible.js";
import FeatherIcon from "@agir/front/genericComponents/FeatherIcon";
import { Column, Hide, Row } from "@agir/front/genericComponents/grid";

import DiscountCodes from "@agir/groups/groupComponents/DiscountCodes";
import { handleEventExceptForInteractiveChild } from "@agir/lib/utils/dom";

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
  displayGroupLogo,
  displayType,
  displayDescription,
  displayMembership,
  isEmbedded = false,
  backLink,
}) => {
  const history = useHistory();

  const handleClick = useCallback(
    (e) => {
      id &&
        handleEventExceptForInteractiveChild(e, () => {
          history.push(routeConfig.groupDetails.getLink({ groupPk: id }));
        });
    },
    [history, id],
  );

  return (
    <Card onClick={isEmbedded ? undefined : handleClick}>
      <Row gutter={6}>
        {displayGroupLogo && (
          <Column collapse={0}>
            <Link
              aria-label={name}
              route="groupDetails"
              routeParams={{ groupPk: id }}
              backLink={backLink}
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
              route="groupDetails"
              routeParams={{ groupPk: id }}
              backLink={backLink}
            >
              {name}
            </Link>
          </h3>
          <small style={{ color: style.black500 }}>
            {eventCount || membersCount
              ? [
                  eventCount &&
                    `${eventCount} acci${eventCount > 1 ? "ones" : "ón"}`,
                  membersCount &&
                    `${membersCount} participante${membersCount > 1 ? "s" : ""}`,
                ]
                  .filter(Boolean)
                  .join(" · ")
              : null}
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

      <StyledRow gutter={6} style={{ paddingTop: ".5rem" }}>
        {!isEmbedded && !isMember && (
          <Button
            key="join"
            color="primary"
            link
            route="groupDetails"
            routeParams={{ groupPk: id }}
            backLink={backLink}
          >
            Unirse
            <Hide as="span" $under={800}>
              &nbsp;{/*_("le groupe")*/} al Grupo
            </Hide>
          </Button>
        )}
        <Button
          link
          key="browse"
          color="default"
          route="groupDetails"
          routeParams={{ groupPk: id }}
          backLink={backLink}
        >
          {/*_("Voir le groupe")*/} Ver Grupo
        </Button>
        {isManager && (
          <Button
            key="manage"
            link
            route="groupSettings"
            routeParams={{ groupPk: id }}
            backLink={backLink}
            icon="settings"
          >
           Gestión
          </Button>
        )}
      </StyledRow>

      {displayMembership && isMember && (
        <div style={{ marginTop: "1em" }}>
          <FeatherIcon small inline name="check" /> {_("Vous êtes membre du groupe")}
        </div>
      )}
    </Card>
  );
};

GroupCard.propTypes = {
  id: PropTypes.string.isRequired,
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
  isEmbedded: PropTypes.bool,
  isCertified: PropTypes.bool,
  backLink: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

GroupCard.defaultProps = {
  displayGroupLogo: true,
  displayType: true,
  displayDescription: true,
  displayMembership: true,
  isManager: false,
};

export default GroupCard;
