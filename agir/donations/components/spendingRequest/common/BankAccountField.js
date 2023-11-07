import _ from "gettext";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import styled from "styled-components";

import TextField from "@agir/front/formComponents/TextField";
import FileField from "@agir/front/formComponents/FileField";

const StyledField = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
`;

const BankAccountField = (props) => {
  const { onChange, value = {}, error, disabled, required } = props;
  const { name, iban, bic, rib } = value;

  const handleChange = useCallback(
    (e) => {
      onChange && onChange(props.name, e.target.name, e.target.value);
    },
    [props.name, onChange],
  );

  const handleChangeRib = useCallback(
    (value) => {
      onChange && onChange(props.name, "rib", value);
    },
    [props.name, onChange],
  );

  return (
    <StyledField>
      <TextField
        label={_("Titulaire du compte")}
        id="name"
        name="name"
        value={name}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        error={
          error && Array.isArray(error.name) ? error.name[0] : error?.name || ""
        }
        maxLength={255}
        hasCounter={false}
      />
      <TextField
        label={<abbr title={_("International Bank Account Number")}>IBAN</abbr>}
        id="iban"
        name="iban"
        value={iban}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        error={
          error && Array.isArray(error.iban) ? error.iban[0] : error?.iban || ""
        }
      />
      <TextField
        label={<abbr title={_("Bank Identifier Code")}>BIC</abbr>}
        id="bic"
        name="bic"
        value={bic}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        error={
          error && Array.isArray(error.bic) ? error.bic[0] : error?.bic || ""
        }
      />
      <FileField
        label={<abbr title={_("Relevé d'Identité Bancaire")}>RIB</abbr>}
        id="rib"
        name="rib"
        value={rib}
        onChange={handleChangeRib}
        disabled={disabled}
        required={required}
        error={
          error && Array.isArray(error.rib) ? error.rib[0] : error?.rib || ""
        }
        helpText="Formats acceptés : PDF, JPEG, PNG."
      />
    </StyledField>
  );
};
BankAccountField.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.shape({
    name: PropTypes.string,
    iban: PropTypes.string,
    bic: PropTypes.string,
    rib: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
  error: PropTypes.shape({
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    iban: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    bic: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    rib: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  }),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};
export default BankAccountField;
