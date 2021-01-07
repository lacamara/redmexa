import { transparentize } from "polished";
import PropTypes from "prop-types";
import React from "react";
import { BottomSheet as RSBS } from "react-spring-bottom-sheet";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";
import "react-spring-bottom-sheet/dist/style.css";

const StyledBottomSheetFooter = styled.footer`
  &::before {
    content: "";
    display: block;
    width: calc(100% - 3rem);
    height: 1px;
    margin: 0 auto;
    background-color: ${style.black200};
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    box-shadow: none;
    border: none;
    height: 54px;
    font-size: 0.875rem;
    width: 100%;
    cursor: pointer;
  }
`;
const StyledBottomSheet = styled(RSBS)`
  [data-rsbs-backdrop] {
    background-color: ${transparentize(0.4, style.black1000)};
  }
  [data-rsbs-footer] {
    padding: 0;
    box-shadow: none;
  }
`;

export const BottomSheet = (props) => {
  const { isOpen, onDismiss, children } = props;
  return (
    <StyledBottomSheet
      open={isOpen}
      onDismiss={onDismiss}
      defaultSnap={({ snapPoints, minHeight, lastSnap }) =>
        lastSnap || Math.min(minHeight, snapPoints[0])
      }
      snapPoints={({ maxHeight }) => [
        2 * (maxHeight / 3),
        maxHeight - maxHeight / 10,
        maxHeight / 3,
      ]}
      footer={
        <StyledBottomSheetFooter>
          <button onClick={onDismiss}>Fermer</button>
        </StyledBottomSheetFooter>
      }
    >
      {children}
    </StyledBottomSheet>
  );
};

BottomSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  children: PropTypes.node,
};
export default BottomSheet;
