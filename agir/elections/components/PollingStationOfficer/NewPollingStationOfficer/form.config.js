import _ from "gettext";
import I18N from "@agir/lib/i18n";
import validate from "@agir/lib/utils/validate";

const INITIAL_DATA = {
  firstName: "",
  lastName: "",
  gender: "",
  birthName: "",
  birthDate: "",
  birthCity: "",
  birthCountry: I18N.country,
  votingCirconscriptionLegislative: null,
  votingLocation: null,
  pollingStation: "",
  voterId: "",
  role: null,
  availableVotingDates: [],
  address1: "",
  address2: "",
  zip: "",
  city: "",
  country: I18N.country,
  email: "",
  phone: "",
  remarks: "",
};

export const getInitialData = (pollingStationOfficer, user) =>
  pollingStationOfficer
    ? {
        ...INITIAL_DATA,
        ...pollingStationOfficer,
      }
    : user
    ? {
        ...INITIAL_DATA,
        email: user.email || "",
        phone: user.contactPhone || "",
        dateOfBirth: user.dateOfBirth || "",
        address1: user.address1 || "",
        address2: user.address2 || "",
        zip: user.zip || "",
        city: user.city || "",
        country: user.country || "",
      }
    : { ...INITIAL_DATA };

export const POLLING_STATION_OFFICER_CONSTRAINTS = {
  firstName: {
    presence: {
      allowEmpty: false,
      message: _("Ce champ est obligatoire"),
    },
    length: {
      maximum: 255,
      tooLong:
        _("La valeur de ce champ ne peut pas dépasser les %{count} caractères"),
    },
  },
  lastName: {
    presence: {
      allowEmpty: false,
      message: _("Ce champ ne peut être vide."),
    },
    length: {
      maximum: 255,
      tooLong:
        _("La valeur de ce champ ne peut pas dépasser les %{count} caractères"),
    },
  },
  birthName: {
    presence: {
      allowEmpty: true,
    },
    length: {
      maximum: 255,
      tooLong: _("Assurez-vous que ce champ comporte au plus 255 caractères."),
    },
  },
  gender: {
    presence: {
      allowEmpty: false,
      message: _("Ce champ ne peut être vide."),
    },
  },
  birthDate: {
    presence: {
      allowEmpty: false,
      message: _("Ce champ ne peut être vide."),
    },
    date: {
      message: _("Indiquez une date valide"),
    },
  },
  birthCity: {
    presence: {
      allowEmpty: false,
      message:_( "Ce champ ne peut être vide."),
    },
    length: {
      maximum: 255,
      tooLong:
        _("La valeur de ce champ ne peut pas dépasser les %{count} caractères"),
    },
  },
  birthCountry: {
    presence: {
      allowEmpty: false,
      message: _("Ce champ ne peut être vide."),
    },
  },
  address1: {
    presence: {
      allowEmpty: false,
      message: _("Ce champ ne peut être vide."),
    },
    length: {
      maximum: 255,
      tooLong:
        _("La valeur de ce champ ne peut pas dépasser les %{count} caractères"),
    },
  },
  address2: {
    presence: {
      allowEmpty: true,
    },
    length: {
      maximum: 255,
      tooLong:
        _("La valeur de ce champ ne peut pas dépasser les %{count} caractères"),
    },
  },
  zip: {
    presence: {
      allowEmpty: false,
      message: _("Ce champ ne peut être vide."),
    },
    length: {
      maximum: 20,
      tooLong:
        _("La valeur de ce champ ne peut pas dépasser les %{count} caractères"),
    },
  },
  city: {
    presence: {
      allowEmpty: false,
      message: _("Ce champ ne peut être vide."),
    },
    length: {
      maximum: 255,
      tooLong:
        _("La valeur de ce champ ne peut pas dépasser les %{count} caractères"),
    },
  },
  country: {
    presence: {
      allowEmpty: false,
      message: _("Ce champ ne peut être vide."),
    },
  },
  votingLocation: {
    presence: {
      allowEmpty: false,
      message: _("Cette sélection ne peut être vide."),
    },
  },
  pollingStation: {
    presence: {
      allowEmpty: false,
      message: _("Ce champ est obligatoire"),
    },
    length: {
      maximum: 255,
      tooLong:
        _("La valeur de ce champ ne peut pas dépasser les %{count} caractères"),
    },
  },
  voterId: {
    presence: {
      allowEmpty: false,
      message: _("Ce champ est obligatoire"),
    },
    length: {
      maximum: 255,
      tooLong:
        _("La valeur de ce champ ne peut pas dépasser les %{count} caractères"),
    },
  },
  votingCirconscriptionLegislative: {
    presence: {
      allowEmpty: false,
      message: _("Ce champ est obligatoire"),
    },
  },
  role: {
    presence: {
      allowEmpty: false,
      message: _("Cette sélection ne peut être vide."),
    },
  },
  hasMobility: {
    type: "boolean",
  },
  availableVotingDates: {
    presence: {
      allowEmpty: false,
      message: _("Cette sélection ne peut être vide."),
    },
  },
  email: {
    presence: {
      allowEmpty: false,
      message: "Ce champ ne peut être vide.",
    },
    email: {
      message: "Introduzca una dirección de correo electrónico válida.",
    },
  },
  phone: {
    presence: {
      allowEmpty: false,
      message: "Ce champ ne peut être vide.",
    },
    phone: {
      message: _("Saisissez un numéro de téléphone valide."),
    },
  },
  remarks: {
    presence: {
      allowEmpty: true,
    },
    length: {
      maximum: 255,
      tooLong: _("Assurez-vous que ce champ comporte au plus 255 caractères."),
    },
  },
};

export const validatePollingStationOfficer = (data) =>
  validate(data, POLLING_STATION_OFFICER_CONSTRAINTS, {
    format: "cleanMessage",
    fullMessages: false,
  });
