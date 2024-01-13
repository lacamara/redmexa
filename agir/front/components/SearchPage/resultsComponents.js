import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";

import { Interval } from "luxon";
import styled from "styled-components";

import Button from "@agir/front/genericComponents/Button";
import Spacer from "@agir/front/genericComponents/Spacer";
import { ResponsiveLayout } from "@agir/front/genericComponents/grid";
import EventCard from "@agir/front/genericComponents/EventCard";
import GroupSuggestionCard from "@agir/groups/groupPage/GroupSuggestionCard";
import { GroupSuggestionCarousel } from "@agir/groups/groupPage/GroupSuggestions";

const StackedGroupList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
  grid-gap: 1rem;

  & > div {
    max-width: unset;
    width: 100%;
  }
`;

const CarrouselContainer = styled.div`
  margin-left: -12px;
  margin-right: -12px;
`;

const StyledSubtitle = styled.h3`
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 600;
`;

export const GroupList = ({ groups, inline = false }) =>
  inline ? (
    <CarrouselContainer>
      <GroupSuggestionCarousel groups={groups} />
    </CarrouselContainer>
  ) : (
    <StackedGroupList>
      {groups?.map((group) => (
        <GroupSuggestionCard key={group.id} {...group} />
      ))}
    </StackedGroupList>
  );
GroupList.propTypes = {
  groups: PropTypes.array,
};

const EventItem = ({ event }) => (
  <>
    <EventCard {...event} />
    <Spacer size="1rem" />
  </>
);
EventItem.propTypes = {
  event: PropTypes.object,
};

export const EventList = ({ events }) => {
  const pastEvents = [];
  const futureEvents = [];
  events.map((event) => {
    event = {
      ...event,
      schedule: Interval.fromISO(`${event.startTime}/${event.endTime}`),
    };
    if (new Date() > new Date(event.endTime)) {
      pastEvents.push(event);
    } else {
      futureEvents.push(event);
    }
  });

  return (
    <>
      {!!futureEvents?.length && (
        <StyledSubtitle>{_("Événements à venir")}</StyledSubtitle>
      )}
      {futureEvents.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
      {!!pastEvents?.length && (
        <StyledSubtitle>{_("Événements passés")}</StyledSubtitle>
      )}
      {pastEvents.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </>
  );
};
EventList.propTypes = {
  events: PropTypes.array,
};

export const ListTitle = ({ name, length = 0, onShowMore }) => (
  <h2>
    <div>
      {name} {length > 0 && <span>{length}</span>}
    </div>
    {onShowMore && (
      <Button color="primary" small onClick={onShowMore}>
        {"Ver todo"}
      </Button>
    )}
  </h2>
);

ListTitle.propTypes = {
  length: PropTypes.number,
  name: PropTypes.string,
  onShowMore: PropTypes.func,
};

export const NoResults = ({ name, list }) => {
  if (!Array.isArray(list) || !!list.length) {
    return null;
  }
  return (
    <>
      <Spacer size="1rem" />
      {name == "grupo" ? "Ningún" : "Ninguna"} {name} {" encontrad"}
      {name == "grupo" ? "o" : "a"} {" con esta búsqueda"}
    </>
  );
};
NoResults.propTypes = {
  list: PropTypes.array,
  name: PropTypes.string,
};
