# Generated by Django 3.0.5 on 2020-07-19 22:04

from django.db import migrations
import djongo.models.fields
import photo.models


class Migration(migrations.Migration):

    dependencies = [
        ('photo', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photo',
            name='tag',
            field=djongo.models.fields.EmbeddedField(model_container=photo.models.Tag, null=True),
        ),
    ]