import PropTypes from "prop-types";
import React, { useCallback } from "react";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import Avatar from "@agir/front/genericComponents/Avatar";

const StyledUnreadCommentBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: ${style.redNSP};
  text-align: center;
  border-radius: 100%;
  font-weight: 700;
  font-size: 0.813rem;
  line-height: 0;
  color: ${({ $empty }) => ($empty ? style.redNSP : style.white)};
  opacity: ${({ $empty }) => ($empty ? "0" : "1")};
  transform: scale(${({ $empty }) => ($empty ? "0" : "1")});
  transition: color, opacity, transform 150ms ease-out;
  will-change: color, opacity, transform;
`;

const StyledCard = styled.button`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
  cursor: pointer;
  background-color: ${({ $selected }) =>
    $selected ? style.black50 : style.white};

  box-shadow: inset ${({ $selected }) => ($selected ? "2px" : "0px")} 0px 0px
    ${style.primary500};

  & > * {
    flex: 0 0 auto;
  }

  ${Avatar} {
    width: 2.5rem;
    height: 2.5rem;
  }

  & > article {
    flex: 1 1 auto;
    margin: 0 12px;
    min-width: 0;

    h5,
    p {
      font-weight: 400;
      font-size: 0.875rem;
      color: ${style.black700};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
    }

    h5 strong {
      font-weight: inherit;
      font-size: 1rem;
      color: ${style.black1000};
    }
  }
`;

const MessageThreadCard = (props) => {
  const {
    message: { id, author, group, text },
    unreadCommentCount,
    isSelected,
    onClick,
  } = props;

  const handleClick = useCallback(() => {
    onClick && onClick(id);
  }, [onClick, id]);

  return (
    <StyledCard type="button" onClick={handleClick} $selected={isSelected}>
      <Avatar name={author?.displayName} image={author?.image} />
      <article>
        <h5 title={`${author?.displayName} • ${group?.name}`}>
          <strong>{author?.displayName}</strong>&nbsp;•&nbsp;{group?.name}
        </h5>
        <p title={text}>{text}</p>
      </article>
      <StyledUnreadCommentBadge
        aria-label="Nombre de commentaires non lus"
        $empty={unreadCommentCount === 0}
      >
        {unreadCommentCount}
      </StyledUnreadCommentBadge>
    </StyledCard>
  );
};

MessageThreadCard.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      image: PropTypes.string,
    }).isRequired,
    group: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool,
  unreadCommentCount: PropTypes.number,
  onClick: PropTypes.func,
};

export default MessageThreadCard;
