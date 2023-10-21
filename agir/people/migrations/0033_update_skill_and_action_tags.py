# Generated by Django 3.2.20 on 2023-10-21 01:25

from django.db import migrations

skills_tags = [
    ("skill:empresariado", "Empresariado"),
    ("skill:sindicalismo", "Sindicalismo"),
    ("skill:liderazgo_comunitario", "Liderazgo comunitario"),
    ("skill:liderazgo_religioso/de_fe", "Liderazgo Religioso/de Fe"),
    ("skill:derechos_de_migrantes", "Derechos de migrantes"),
    ("skill:derechos_de_la_mujer", "Derechos de la mujer"),
    ("skill:derechos_de_grupos_indígenas", "Derechos de grupos indígenas"),
    (
        "skill:derechos_de_personas_discapacitadas",
        "Derechos de personas discapacitadas",
    ),
    ("skill:derechos_de_especies_naturales", "Derechos de especies naturales"),
    ("skill:ambientalismo", "Ambientalismo"),
    ("skill:dreamers", "Dreamers"),
    ("skill:arte/música", "Arte/Música"),
    ("skill:influencers", "Influencers"),
    ("skill:medios/prensa", "Medios/Prensa"),
    ("skill:deportes", "Deportes"),
    ("skill:academia", "Academia"),
    ("skill:ciencia/medicina", "Ciencia/Medicina"),
    ("skill:lgbt", "LGBT"),
    ("skill:campesinos", "Campesinos"),
    ("skill:morena", "MORENA"),
    ("skill:política", "Política"),
]

action_tags = [
    ("action:hacer_llamadas", "Hacer llamadas", ""),
    ("action:brigadear", "Brigadear", ""),
    ("action:compartir_en_redes", "Compartir en redes", ""),
    ("action:crear/diseñar_contenidos ", "Crear/diseñar contenidos ", ""),
    ("action:redactar_contenidos", "Redactar contenidos", ""),
    ("action:conectar_personas_y_grupos", "Conectar personas y grupos", ""),
    ("action:comunicar/influencer ", "Comunicar/Influencer ", ""),
    ("action:hacer_música_o_arte", "Hacer música o arte", ""),
    ("action:organizar_eventos", "Organizar eventos", ""),
    ("action:desarrollar_código", "Desarrollar código", ""),
]


def add_basic_tags(apps, schema):
    PersonTag = apps.get_model("people", "PersonTag")

    for tag, description in skills_tags:
        PersonTag.objects.update_or_create(
            label="info %s" % tag, defaults={"description": description}
        )

    for tag, short_description, long_description in action_tags:
        description = "**%s**\n\n*%s*" % (short_description, long_description)
        PersonTag.objects.update_or_create(
            label="agir %s" % tag, defaults={"description": description}
        )


class Migration(migrations.Migration):
    dependencies = [
        ("people", "0032_person_municipio"),
    ]

    operations = [
        migrations.RunPython(add_basic_tags, reverse_code=migrations.RunPython.noop)
    ]
