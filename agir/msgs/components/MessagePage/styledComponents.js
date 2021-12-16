import styled from "styled-components";
import style from "@agir/front/genericComponents/_variables.scss";
import Avatar from "@agir/front/genericComponents/Avatar";

export const StyledCard = styled.button`
  width: 100%;
  padding: 1rem;
  display: flex;
  text-align: left;
  justify-content: space-between;
  align-items: center;
  border: none;
  cursor: pointer;
  background-color: ${({ $selected }) =>
    $selected ? style.black50 : style.white};
  box-shadow: inset ${({ $selected }) => ($selected ? "2px" : "0px")} 0px 0px
    ${style.primary500};

  &[disabled] {
    cursor: default;
  }

  & > * {
    flex: 0 0 auto;
  }

  & > ${Avatar} {
    width: 50px;
    height: 50px;
    margin-right: 8px;
  }

  & > article {
    flex: 1 1 auto;
    margin: 0 18px 0 12px;
    min-width: 0;
    color: ${style.black700};

    h6,
    h5,
    p {
      margin: 0 0 0.25rem;
      padding: 0;
      display: block;
      font-weight: 400;
      font-size: 0.875rem;
    }

    h6,
    h5,
    p span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    h6 {
      color: ${(props) => props.theme.primary500};
    }

    h5 {
      font-size: 1rem;
      font-weight: 500;
      color: ${style.black1000};
    }

    ${({ isOrganizationMessage }) =>
      isOrganizationMessage &&
      `h5 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        max-height: 42px;
        overflow: hidden;
        white-space: normal;
      }`}

    p {
      display: flex;
      justify-content: flex-start;

      & > * {
        flex: 0 0 auto;
        margin: 0;

        :first-child {
          flex: 0 1 auto;
        }
      }
    }
  }
`;