# Generated by Django 2.2.12 on 2021-03-26 20:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Rising_Tide_App', '0002_auto_20210326_1509'),
    ]

    operations = [
        migrations.AlterField(
            model_name='distancetocoast',
            name='id',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]
