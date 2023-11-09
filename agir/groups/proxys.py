from django.db import models
from django.utils.functional import cached_property

from agir.groups.models import SupportGroup, SupportGroupQuerySet
from agir.groups.utils import certification
from django.utils.translation import gettext as _


class ThematicGroupManager(models.Manager.from_queryset(SupportGroupQuerySet)):
    def get_queryset(self):
        return super().get_queryset().filter(type=SupportGroup.TYPE_THEMATIC)


class ThematicGroup(SupportGroup):
    objects = ThematicGroupManager()

    class Meta:
        default_permissions = ("view", "change")
        verbose_name = _("Groupe thématique")
        verbose_name_plural = _("Groupes thématiques")
        proxy = True


class UncertifiableGroupManager(models.Manager.from_queryset(SupportGroupQuerySet)):
    def get_queryset(self):
        return super().get_queryset().uncertifiable()


class UncertifiableGroup(SupportGroup):
    objects = UncertifiableGroupManager()

    @cached_property
    def cc_creation(self):
        return certification.check_criterion_creation(self)

    @cached_property
    def cc_members(self):
        return certification.check_criterion_members(self)

    @cached_property
    def cc_activity(self):
        return certification.check_criterion_activity(self)

    @cached_property
    def cc_gender(self):
        return certification.check_criterion_gender(self)

    @cached_property
    def cc_exclusivity(self):
        return certification.check_criterion_exclusivity(self)

    class Meta:
        default_permissions = ("view", "change")
        verbose_name = _("Groupe décertifiable")
        verbose_name_plural = _("Groupes décertifiables")
        proxy = True
