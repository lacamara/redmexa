import _ from "gettext";
import React from "react";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import { getRoutes } from "@agir/front/globalContext/reducers";
import { useSelector } from "@agir/front/globalContext/GlobalContext";

import { LayoutTitle } from "@agir/front/app/Layout/StyledComponents";
import Button from "@agir/front/genericComponents/Button";

const StyledHeader = styled.header`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin: 0 0 25px;

  & > ${LayoutTitle} {
    margin: 0;

    @media (max-width: ${style.collapse}px) {
      flex: 0 0 100%;
      margin-bottom: 1rem;
    }
  }

  & > div {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;

    @media only screen and (max-width: ${style.collapse}px) {
      flex-direction: row;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
    }
  }

  & ${Button} + ${Button} {
    @media only screen and (min-width: ${style.collapse}px) {
      margin-right: 0.5rem;
    }
    @media only screen and (max-width: ${style.collapse}px) {
      margin-left: 0.5rem;
    }
  }
`;

const GroupsPageHeader = () => {
  const routes = useSelector(getRoutes);
  return (
    <StyledHeader>
      <LayoutTitle>Mis grupos{/*_("Mes groupes")*/}</LayoutTitle>
      <div>
        {routes.createGroup && (
          <Button
            link
            href={routes.createGroup}
            icon="plus"
            color="secondary"
            small
          >
            {/*_("Créer un groupe")*/}Crear un grupo
          </Button>
        )}
        <Button link icon="map" route="groupMap" small>
          {_("Carte")}
        </Button>
      </div>
    </StyledHeader>
  );
};

export default GroupsPageHeader;
