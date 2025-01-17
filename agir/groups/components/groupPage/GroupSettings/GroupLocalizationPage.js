import _ from "gettext";
import PropTypes from "prop-types";
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import useSWR from "swr";

import { useToast } from "@agir/front/globalContext/hooks.js";

import style from "@agir/front/genericComponents/_variables.scss";

import Button from "@agir/front/genericComponents/Button";
import Spacer from "@agir/front/genericComponents/Spacer";
import Map from "@agir/carte/common/Map";
import HeaderPanel from "@agir/front/genericComponents/ObjectManagement/HeaderPanel";
import BackButton from "@agir/front/genericComponents/ObjectManagement/BackButton";
import LocationField from "@agir/front/formComponents/LocationField";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents";

import { updateGroup, getGroupEndpoint } from "@agir/groups/utils/api";

const StyledMap = styled(Map)`
  height: 208px;
`;

const StyledMapConfig = styled(Map)`
  height: calc(100vh - 230px);

  @media (min-width: ${style.collapse}px) {
    height: 400px;
  }
`;

const GroupLocalizationPage = (props) => {
  const { onBack, illustration, groupPk } = props;
  const sendToast = useToast();
  const [formLocation, setFormLocation] = useState({});
  const [config, setConfig] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { data: group, mutate } = useSWR(
    getGroupEndpoint("getGroup", { groupPk }),
  );

  const handleInputChange = useCallback((_, name, value) => {
    setFormLocation((formLocation) => ({ ...formLocation, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setErrors({});
      setIsLoading(true);
      const res = await updateGroup(groupPk, { location: formLocation });
      setIsLoading(false);
      if (res.error) {
        setErrors(res.error?.location);
        return;
      }
      sendToast("Información actualizada", "SUCCESS", { autoClose: true });
      mutate((group) => {
        return { ...group, ...res.data };
      });
    },
    [formLocation, groupPk, mutate, sendToast],
  );

  useEffect(() => {
    setIsLoading(false);
    setFormLocation({
      name: group?.location.name,
      address1: group?.location.address1,
      address2: group?.location.address2,
      zip: group?.location.zip,
      city: group?.location.city,
      country: group?.location.country,
    });
  }, [group]);

  if (config) {
    return (
      <>
        <BackButton
          onClick={() => {
            setConfig(false);
          }}
        />
        <StyledTitle>Personalizar la ubicacioón en el mapa</StyledTitle>

        <Spacer size="1rem" />
        <StyledMapConfig center={group?.location?.coordinates?.coordinates} />

        <Spacer size="2rem" />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button color="secondary" wrap disabled={isLoading}>
            {_("Enregistrer les informations")}
          </Button>
        </div>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <HeaderPanel onBack={onBack} illustration={illustration} />
      <StyledTitle>Ubicación</StyledTitle>
      <Spacer size="1rem" />
      <StyledMap
        center={group?.location?.coordinates?.coordinates || []}
        iconConfiguration={group?.iconConfiguration}
      />
      <Spacer size="0.5rem" />
      {/* <Button small wrap onClick={() => setConfig(true)}>
        Personnaliser la localisation sur la carte
      </Button> */}
      <Button link small wrap href={group?.routes?.geolocate}>
       {_(" Personnaliser la localisation sur la carte")}
      </Button>
      <Spacer size="1rem" />

      <span style={{ color: style.black700 }}>
        {_("Si vous ne souhaitez pas rendre votre adresse personnelle publique, indiquez un endroit à proximité (café, mairie...)")}
        <Spacer size="0.5rem" />
        <strong>
        Indica una dirección precisa, con número de calle, para que el grupo pueda aparecer en el mapa.        </strong>
      </span>

      <Spacer size="1.5rem" />

      <LocationField
        name="location"
        location={formLocation}
        onChange={handleInputChange}
        error={errors && errors.location}
        required
      />

      <Spacer size="2rem" />
      <Button type="submit" color="secondary" wrap disabled={isLoading}>
        {_("Enregistrer")}
      </Button>

      {/* <hr />
      <Spacer size="1rem" />
      <a href="#" style={{ color: style.redNSP }}>
        Supprimer la localisation (déconseillé)
      </a> */}
    </form>
  );
};
GroupLocalizationPage.propTypes = {
  onBack: PropTypes.func,
  illustration: PropTypes.string,
  groupPk: PropTypes.string,
};
export default GroupLocalizationPage;
