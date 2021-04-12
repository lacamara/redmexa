import React from "react";

import styled from "styled-components";
import style from "@agir/front/genericComponents/_variables.scss";
import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";

const StyledLink = styled.a`
  display: inline-flex;
  align-items: center;
  flex-direction: row;
  font-weight: 2rem;
  color: ${style.black1000};
`;

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

const GroupLink = (props) => {
  const { label, url } = props;

  return (
    <StyledRow>
      <StyledLink href={url} target="_blank" rel="noopener noreferrer">
        <RawFeatherIcon
          name="globe"
          width="1.5rem"
          height="1.5rem"
          style={{ color: style.primary500, marginRight: "1rem" }}
        />
        {label}
      </StyledLink>

      <RawFeatherIcon name="edit-2" width="1rem" height="1rem" />
    </StyledRow>
  );
};

export default GroupLink;
