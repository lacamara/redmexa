# Generated by Django 2.1.5 on 2019-01-14 14:51

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0008_auto_20190114_1514'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='created',
            field=models.DateTimeField(default=django.utils.timezone.now, editable=False, verbose_name='created'),
        ),
    ]
