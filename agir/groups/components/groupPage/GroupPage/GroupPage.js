import _ from "gettext";
import PropTypes from "prop-types";
import React, { useMemo } from "react";

import { ResponsiveLayout } from "@agir/front/genericComponents/grid";
import { PageFadeIn } from "@agir/front/genericComponents/PageFadeIn";

import DesktopGroupPage, { DesktopGroupPageSkeleton } from "./DesktopGroupPage";
import MobileGroupPage, { MobileGroupPageSkeleton } from "./MobileGroupPage";

import NotFoundPage from "@agir/front/notFoundPage/NotFoundPage.js";
import OpenGraphTags from "@agir/front/app/OpenGraphTags";

export const GroupPage = (props) => {
  const { isLoading, group } = props;

  const backLink = useMemo(
    () => ({
      route: "groupDetails",
      routeParams: { groupPk: group?.id },
      label: group?.name,
    }),
    [group],
  );

  return (
    <PageFadeIn
      ready={!isLoading}
      wait={
        <ResponsiveLayout
          DesktopLayout={DesktopGroupPageSkeleton}
          MobileLayout={MobileGroupPageSkeleton}
        />
      }
    >
      {group && (
        <OpenGraphTags
          type="article"
          title={group.name}
          description={group.textDescription}
          image={group.image}
        />
      )}
      {group === false ? (
        <NotFoundPage
          hasTopBar={false}
          title={_("Groupe")}
          subtitle={_("Ce groupe")}
          reloadOnReconnection={false}
        />
      ) : (
        <ResponsiveLayout
          {...props}
          MobileLayout={MobileGroupPage}
          DesktopLayout={DesktopGroupPage}
          backLink={backLink}
        />
      )}
    </PageFadeIn>
  );
};
GroupPage.propTypes = {
  group: PropTypes.object,
  isLoading: PropTypes.bool,
  activeTab: PropTypes.string,
};
export default GroupPage;
