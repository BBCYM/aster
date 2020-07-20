# Generated by Django 3.0.5 on 2020-07-19 16:35

from django.db import migrations, models
import djongo.models.fields
import photo.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('photoId', models.CharField(max_length=255, primary_key=True, serialize=False)),
                ('userId', models.CharField(max_length=255)),
                ('tag', djongo.models.fields.EmbeddedField(model_container=photo.models.Tag)),
                ('location', models.CharField(max_length=255)),
                ('time', models.DateTimeField()),
            ],
        ),
    ]
