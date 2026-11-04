from django.db import migrations


ESTADOS = [
    ('pendiente', False),
    ('confirmada', False),
    ('atendida', True),
    ('cancelada', True),
]


def crear_estados(apps, schema_editor):
    EstadoCita = apps.get_model('citas', 'EstadoCita')
    for nombre, es_final in ESTADOS:
        EstadoCita.objects.update_or_create(
            nombre=nombre,
            defaults={'es_final': es_final},
        )


class Migration(migrations.Migration):

    dependencies = [
        ('citas', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(crear_estados, migrations.RunPython.noop),
    ]
