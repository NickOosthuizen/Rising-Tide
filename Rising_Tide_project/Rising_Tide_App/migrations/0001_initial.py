# Generated by Django 2.2.12 on 2021-03-26 19:36

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DistanceToCoast',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('longitude', models.FloatField(blank=True, null=True)),
                ('latitude', models.FloatField(blank=True, null=True)),
                ('distance', models.FloatField(blank=True, null=True)),
            ],
            options={
                'db_table': 'distance_to_coast',
                'managed': False,
            },
        ),
    ]
