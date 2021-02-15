import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import React from "react";

import GroupMessages from "@agir/groups/groupPage/GroupMessages";

const MessagesRoute = ({
  group,
  allEvents,
  isLoadingMessages,
  loadMorePastEvents,
  onClickMessage,
  ...rest
}) => (
  <>
    <Helmet>
      <title>Messages du groupe : {group.name} - Action populaire</title>
    </Helmet>
    <GroupMessages
      {...rest}
      group={group}
      events={allEvents}
      isLoading={isLoadingMessages}
      onClick={onClickMessage}
      loadMoreEvents={loadMorePastEvents}
    />
  </>
);
MessagesRoute.propTypes = {
  group: PropTypes.shape({
    name: PropTypes.string,
  }),
  allEvents: PropTypes.arrayOf(PropTypes.object),
  isLoadingMessages: PropTypes.bool,
  loadMorePastEvents: PropTypes.func,
  onClickMessage: PropTypes.func,
};

export default MessagesRoute;
