import tinymce from "tinymce/tinymce";

// Required modules
import "tinymce/models/dom";
import "tinymce/icons/default";
import "tinymce/themes/silver";

// Plugins
import "tinymce/plugins/link";
import "tinymce/plugins/autolink";
import "tinymce/plugins/image";
import "tinymce/plugins/lists";

// Localisation
import "@agir/lib/i18n/tinymce";

import I18N from "@agir/lib/i18n";
import onDOMReady from "@agir/lib/utils/onDOMReady";

/**
 * Indique à webpack comment copier les fichiers de skins de tinymce dans
 */
require.context(
  "file-loader?name=[path][name].[ext]&context=node_modules/tinymce!tinymce/skins",
  true,
  /.*/,
);

const config = {
  selector: "textarea.richeditorwidget",
  plugins: "link autolink image lists",
  toolbar: "bold italic | blocks | link image | bullist numlist",
  menubar: false,
  statusbar: false,
  language: I18N.datetimeLocale,
  block_formats: "Paragraphe=p;Titre=h2;Sous-titre=h3;Petit titre=h4",
  skin: "oxide",
  skin_url: "/static/components/skins/ui/oxide",
};

const initRichEditor = () => {
  if (!window.AgirRichEditor) {
    tinymce.init(config);
    window.AgirRichEditor = 1;
  }
};

onDOMReady(initRichEditor);
