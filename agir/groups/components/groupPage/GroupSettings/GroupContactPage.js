import _ from "gettext";
import PropTypes from "prop-types";
import React, { useState, useEffect, useCallback } from "react";
import useSWR from "swr";

import { useToast } from "@agir/front/globalContext/hooks.js";

import style from "@agir/front/genericComponents/_variables.scss";

import Spacer from "@agir/front/genericComponents/Spacer";
import Button from "@agir/front/genericComponents/Button";
import TextField from "@agir/front/formComponents/TextField";
import CheckboxField from "@agir/front/formComponents/CheckboxField";
import HeaderPanel from "@agir/front/genericComponents/ObjectManagement/HeaderPanel";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents";

import { updateGroup, getGroupEndpoint } from "@agir/groups/utils/api";

const GroupContactPage = (props) => {
  const { onBack, illustration, groupPk } = props;
  const sendToast = useToast();
  const [contact, setContact] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsloading] = useState(true);

  const { data: group, mutate } = useSWR(
    getGroupEndpoint("getGroup", { groupPk }),
  );

  const handleCheckboxChange = useCallback(
    (e) => {
      setContact({ ...contact, [e.target.name]: e.target.checked });
    },
    [contact],
  );

  const handleChange = useCallback(
    (e) => {
      setContact({ ...contact, [e.target.name]: e.target.value });
    },
    [contact],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setErrors({});
      setIsloading(true);
      const res = await updateGroup(groupPk, { contact });
      setIsloading(false);
      if (res.error) {
        setErrors(res.error?.contact);
        return;
      }
      sendToast("Información actualizada", "SUCCESS", { autoClose: true });
      mutate((group) => {
        return { ...group, ...res.data };
      });
    },
    [contact, groupPk, mutate, sendToast],
  );

  useEffect(() => {
    setIsloading(false);
    setContact(group?.contact);
  }, [group]);

  return (
    <form onSubmit={handleSubmit}>
      <HeaderPanel onBack={onBack} illustration={illustration} />
      <StyledTitle>{_("Moyens de contact")}</StyledTitle>

      <Spacer size="1rem" />

      <span style={{ color: style.black700 }}>
        {_("Ces informations seront affichées en public.")}
      </span>
      <Spacer size="0.5rem" />
      <span style={{ color: style.black700 }}>
      Puedes crear y usar una dirección email compartida por el grupo en lugar de indicar un email personal.      </span>

      <Spacer size="2rem" />

      <TextField
        id="name"
        name="name"
        label="Persona de contacto*"
        onChange={handleChange}
        value={contact?.name}
        error={errors?.name}
      />

      <Spacer size="1rem" />

      <TextField
        id="email"
        name="email"
        type="email"
        label="Email del grupo"
        onChange={handleChange}
        value={contact?.email}
        error={errors?.email}
      />

      <Spacer size="1rem" />

      <TextField
        id="phone"
        name="phone"
        label={_("Numéro de téléphone à contacter*")}
        onChange={handleChange}
        value={contact?.phone}
        error={errors?.phone}
      />

      <Spacer size="0.5rem" />

      <CheckboxField
        name="hidePhone"
        label={_("Cacher le numéro de téléphone")}
        value={contact?.hidePhone}
        error={errors?.hidePhone}
        onChange={handleCheckboxChange}
      />

      <Spacer size="2rem" />
      <Button color="secondary" type="submit" disabled={isLoading}>
        {_("Enregistrer")}
      </Button>
    </form>
  );
};
GroupContactPage.propTypes = {
  onBack: PropTypes.func,
  illustration: PropTypes.string,
  groupPk: PropTypes.string,
};
export default GroupContactPage;
