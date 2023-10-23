import _ from "gettext";

const communesConsulats = 
[
  {
    "id": 7,
    "type": "consulate",
    "value": 7,
    "label": "Circonscription « États-Unis d'Amérique — 4e circonscription »",
    "departement": null,
    "countries": ["US"]
  },
  {
    "id": 5,
    "type": "consulate",
    "value": 5,
    "label": "Circonscription « États-Unis d'Amérique — 2e circonscription »",
    "departement": null,
    "countries": ["US"]
  },
  {
    "id": 93,
    "type": "consulate",
    "value": 93,
    "label": "Circonscription « Ethiopie, Soudan, Soudan du Sud »",
    "departement": null,
    "countries": ["ET", "SD", "SS"]
  },
  {
    "id": 103,
    "type": "consulate",
    "value": 103,
    "label": "Circonscription « Arabie saoudite — 2e circonscription (avec Koweït) »",
    "departement": null,
    "countries": ["SA"]
  },
  {
    "id": 42,
    "type": "consulate",
    "value": 42,
    "label": "Circonscription « Allemagne — 2e circonscription »",
    "departement": null,
    "countries": ["DE"]
  },
  {
    "id": 44,
    "type": "consulate",
    "value": 44,
    "label": "Circonscription « Autriche, Slovaquie, Slovénie »",
    "departement": null,
    "countries": ["AT"]
  },
  {
    "id": 105,
    "type": "consulate",
    "value": 105,
    "label": "Circonscription « Iran, Pakistan, Afghanistan, Azerbaïdjan, Turkménistan, Kazakhstan, Tadjikistan, Ouzbékistan, Kirghizstan »",
    "departement": null,
    "countries": ["AF", "AZ", "IR", "KG", "KZ", "PK", "TJ", "TM", "UZ"]
  },
  {
    "id": 104,
    "type": "consulate",
    "value": 104,
    "label": "Circonscription « Emirats arabes unis, Oman »",
    "departement": null,
    "countries": ["AE"]
  },
  {
    "id": 10,
    "type": "consulate",
    "value": 10,
    "label": "Circonscription « États-Unis d'Amérique — 7e circonscription »",
    "departement": null,
    "countries": ["US"]
  },
  {
    "id": 41,
    "type": "consulate",
    "value": 41,
    "label": "Circonscription « Allemagne — 1re circonscription »",
    "departement": null,
    "countries": ["DE"]
  },
  {
    "id": 43,
    "type": "consulate",
    "value": 43,
    "label": "Circonscription « Allemagne — 3e circonscription »",
    "departement": null,
    "countries": ["DE"]
  },
  {
    "id": 26,
    "type": "consulate",
    "value": 26,
    "label": "Circonscription « Paraguay »",
    "departement": null,
    "countries": ["PY"]
  },
  {
    "id": 4,
    "type": "consulate",
    "value": 4,
    "label": "Circonscription « États-Unis d'Amérique — 1re circonscription »",
    "departement": null,
    "countries": ["US"]
  },
  {
    "id": 47,
    "type": "consulate",
    "value": 47,
    "label": "Circonscription « Arménie, Géorgie »",
    "departement": null,
    "countries": ["AM"]
  },
  {
    "id": 67,
    "type": "consulate",
    "value": 67,
    "label": "Circonscription « Algérie — 1re circonscription »",
    "departement": null,
    "countries": ["DZ"]
  },
  {
    "id": 68,
    "type": "consulate",
    "value": 68,
    "label": "Circonscription « Algérie — 2e circonscription »",
    "departement": null,
    "countries": ["DZ"]
  },
  {
    "id": 69,
    "type": "consulate",
    "value": 69,
    "label": "Circonscription « Algérie — 3e circonscription »",
    "departement": null,
    "countries": ["DZ"]
  },
  {
    "id": 9342,
    "type": "commune",
    "value": 9342,
    "label": "27 - Armentières-sur-Avre",
    "departement": "27",
    "countries": null
  },
  {
    "id": 9341,
    "type": "commune",
    "value": 9341,
    "label": "27 - Appeville-Annebault",
    "departement": "27",
    "countries": null
  },
  {
    "id": 9347,
    "type": "commune",
    "value": 9347,
    "label": "27 - Autheuil-Authouillet",
    "departement": "27",
    "countries": null
  },
  {
    "id": 14562,
    "type": "commune",
    "value": 14562,
    "label": "39 - Arsure-Arsurette",
    "departement": "39",
    "countries": null
  },
  {
    "id": 15049,
    "type": "commune",
    "value": 15049,
    "label": "40 - Arthez-d'Armagnac",
    "departement": "40",
    "countries": null
  },
  {
    "id": 21837,
    "type": "commune",
    "value": 21837,
    "label": "59 - Aulnoye-Aymeries",
    "departement": "59",
    "countries": null
  },
  {
    "id": 10925,
    "type": "commune",
    "value": 10925,
    "label": "30 - Arpaillargues-et-Aureillac",
    "departement": "30",
    "countries": null
  },
  {
    "id": 6016,
    "type": "commune",
    "value": 6016,
    "label": "18 - les Aix-d'Angillon",
    "departement": "18",
    "countries": null
  },
  {
    "id": 6020,
    "type": "commune",
    "value": 6020,
    "label": "18 - Apremont-sur-Allier",
    "departement": "18",
    "countries": null
  },
  {
    "id": 31004,
    "type": "commune",
    "value": 31004,
    "label": "80 - Acheux-en-Amiénois",
    "departement": "80",
    "countries": null
  },
  {
    "id": 6030,
    "type": "commune",
    "value": 6030,
    "label": "18 - Augy-sur-Aubois",
    "departement": "18",
    "countries": null
  },
  {
    "id": 8418,
    "type": "commune",
    "value": 8418,
    "label": "25 - Avanne-Aveney",
    "departement": "25",
    "countries": null
  },
  {
    "id": 18171,
    "type": "commune",
    "value": 18171,
    "label": "51 - Aulnay-l'Aître",
    "departement": "51",
    "countries": null
  },
  {
    "id": 17382,
    "type": "commune",
    "value": 17382,
    "label": "48 - Arzenc-d'Apcher",
    "departement": "48",
    "countries": null
  },
  {
    "id": 20037,
    "type": "commune",
    "value": 20037,
    "label": "55 - Autrécourt-sur-Aire",
    "departement": "55",
    "countries": null
  },
  {
    "id": 15039,
    "type": "commune",
    "value": 15039,
    "label": "40 - Aire-sur-l'Adour",
    "departement": "40",
    "countries": null
  },
  {
    "id": 33815,
    "type": "commune",
    "value": 33815,
    "label": "89 - Aisy-sur-Armançon",
    "departement": "89",
    "countries": null
  },
  {
    "id": 13,
    "type": "consulate",
    "value": 13,
    "label": "Circonscription « Argentine »",
    "departement": null,
    "countries": ["AR"]
  },
  {
    "id": 63,
    "type": "consulate",
    "value": 63,
    "label": "Circonscription « Andorre »",
    "departement": null,
    "countries": ["AD"]
  },
  {
    "id": 88,
    "type": "consulate",
    "value": 88,
    "label": "Circonscription « Angola »",
    "departement": null,
    "countries": ["AO"]
  },
  {
    "id": 4008,
    "type": "commune",
    "value": 4008,
    "label": "12 - Agen-d'Aveyron",
    "departement": "12",
    "countries": null
  },
  {
    "id": 3148,
    "type": "commune",
    "value": 3148,
    "label": "10 - Arcis-sur-Aube",
    "departement": "10",
    "countries": null
  },
  {
    "id": 2038,
    "type": "commune",
    "value": 2038,
    "label": "07 - Albon-d'Ardèche",
    "departement": "07",
    "countries": null
  }
]; 


export default communesConsulats;
