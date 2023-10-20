from django.conf import settings
from django.db.models import Q

from agir.gestion.models import Reglement, Document
from agir.gestion.typologies import TypeDocument
from agir.lib.admin.utils import get_admin_link

LIBELLES_MODE = {
    Reglement.Mode.VIREMENT: "VIR",
    Reglement.Mode.PRELEV: "PRLVT",
    Reglement.Mode.CHEQUE: "CHQ",
    Reglement.Mode.CARTE: "CB",
    Reglement.Mode.CASH: "ESP",
}


def lien_document(document):
    if document:
        if fichier := document.fichier:
            return fichier.url

        if document.source_url:
            return document.source_url

        return gestion_admin_link(document)
    return "-"


def references_pieces(reglement):
    pieces = set()

    if reglement.facture:
        pieces.add(reglement.facture)
    if reglement.preuve:
        pieces.add(reglement.preuve)

    pieces.update(reglement.depense.documents.all())

    if reglement.depense.projet:
        pieces.update(reglement.depense.projet.documents.all())

    return ",".join(sorted(d.numero_piece for d in pieces if d.numero_piece))


def autres_pieces(reglement):
    q = Q(depense=reglement.depense) & ~Q(type=TypeDocument.FACTURE)
    if reglement.depense.projet:
        q = q | Q(projet=reglement.depense.projet)
    documents = Document.objects.filter(q).distinct()

    return [lien_document(d) for d in documents]


def gestion_admin_link(instance):
    return f"{settings.PLATFORM_ADMIN_DOMAIN}{get_admin_link(instance)}"
