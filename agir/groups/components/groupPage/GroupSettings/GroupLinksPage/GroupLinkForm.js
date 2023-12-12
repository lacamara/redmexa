import _ from "gettext";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import BackButton from "@agir/front/genericComponents/ObjectManagement/BackButton";
import Button from "@agir/front/genericComponents/Button";
import Spacer from "@agir/front/genericComponents/Spacer.js";
import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents.js";

import TextField from "@agir/front/formComponents/TextField";

const GroupLinkForm = (props) => {
  const { onBack, onSubmit, onDelete, selectedLink, errors, isLoading } = props;
  const [linkData, setLinkData] = useState({});

  useEffect(() => {
    setLinkData(selectedLink || {});
  }, [selectedLink]);

  if (!selectedLink) {
    return null;
  }

  const isNew = !selectedLink.id;

  const handleChange = (e) => {
    setLinkData({
      ...linkData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(linkData);
  };

  const handleDelete = selectedLink.id
    ? () => {
        onDelete(selectedLink.id);
      }
    : undefined;

  return (
    <>
      <BackButton disabled={isLoading} onClick={onBack} />
      <StyledTitle>
        {isNew ? _("Nouveau lien personnalisé") : _("Modifier le lien")}
      </StyledTitle>
      <Spacer size="1rem" />
      <div>
        {_("Attention : ces liens seront disponibles")} <strong>{_("publiquement")}</strong>{" "}
        {_("et tout le monde pourra y accéder. Ne partagez pas de boucles privées.")}
      </div>
      <Spacer size="1.5rem" />
      <form onSubmit={handleSubmit}>
        <TextField
          id="label"
          name="label"
          label="Texto a mostrar"
          helpText="Por ejemplo: FB del grupo o Video de presentación"
          onChange={handleChange}
          value={linkData.label || ""}
          error={errors?.label}
          required
        />
        <Spacer size="1rem" />
        <TextField
          id="url"
          name="url"
          label="Enlace a la página (URL)"
          onChange={handleChange}
          value={linkData.url || ""}
          error={errors?.url}
          required
        />
        <Spacer size="1rem" />
        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <Button
            type="submit"
            disabled={isLoading || !linkData.label || !linkData.url}
            color="secondary"
            style={{ flex: "0 0 auto" }}
          >
            {isNew ? "Agregar enlace" : _("Enregistrer")}
          </Button>
          {handleDelete && (
            <Button
              onClick={handleDelete}
              type="button"
              disabled={isLoading}
              color="danger"
              style={{ flex: "0 0 auto" }}
            >
              {_("Supprimer le lien")}
            </Button>
          )}
        </footer>
      </form>
    </>
  );
};
GroupLinkForm.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  selectedLink: PropTypes.shape({
    id: PropTypes.number,
    label: PropTypes.string,
    url: PropTypes.string,
  }),
  errors: PropTypes.shape({
    label: PropTypes.string,
    url: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
};
export default GroupLinkForm;
