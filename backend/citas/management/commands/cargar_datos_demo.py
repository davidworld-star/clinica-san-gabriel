from datetime import time, timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from citas.models import Cita, Especialidad, EstadoCita, HistoriaClinica, Medico, Paciente


ESPECIALIDADES = [
    ('Pediatría', 'Atención integral de niños y adolescentes.'),
    ('Cardiología', 'Diagnóstico y tratamiento de enfermedades del corazón.'),
    ('Dermatología', 'Cuidado de la piel, cabello y uñas.'),
    ('Medicina General', 'Atención médica integral para toda la familia.'),
]

MEDICOS = [
    ('Valeria Mendoza Ríos', 'CMP 045871', 'Pediatría', '987654321', 'vmendoza@clinicasangabriel.pe'),
    ('Jorge Quispe Huamán', 'CMP 052340', 'Cardiología', '987654322', 'jquispe@clinicasangabriel.pe'),
    ('Camila Flores Vargas', 'CMP 061205', 'Dermatología', '987654323', 'cflores@clinicasangabriel.pe'),
    ('Andrés Ramos Castillo', 'CMP 038914', 'Medicina General', '987654324', 'aramos@clinicasangabriel.pe'),
    ('Lucía Paredes Soto', 'CMP 047782', 'Pediatría', '987654325', 'lparedes@clinicasangabriel.pe'),
    ('Diego Salazar Rojas', 'CMP 055610', 'Cardiología', '987654326', 'dsalazar@clinicasangabriel.pe'),
]

PACIENTES = [
    ('45871236', 'Lucía Fernanda Torres Salazar', '2015-03-14', '912345678', 'lucia.torres@correo.pe'),
    ('72145689', 'Mateo Sebastián Rojas Díaz', '2012-08-22', '923456789', 'mateo.rojas@correo.pe'),
    ('10456782', 'Ana María Castillo Vega', '1988-11-05', '934567890', 'ana.castillo@correo.pe'),
    ('45678912', 'Carlos Alberto Núñez Paredes', '1975-01-30', '945678901', 'carlos.nunez@correo.pe'),
    ('73456128', 'Sofía Valentina Herrera Luna', '1997-06-18', '956789012', 'sofia.herrera@correo.pe'),
    ('61234578', 'José Miguel Salazar Flores', '1969-09-09', '967890123', 'jose.salazar@correo.pe'),
    ('84567123', 'Camila Alejandra Torres Ríos', '2003-12-02', '978901234', 'camila.torres@correo.pe'),
    ('52346789', 'Andrés Felipe Miranda Chávez', '1991-04-27', '989012345', 'andres.miranda@correo.pe'),
]

HISTORIAS = {
    '45871236': ('O+', 'Penicilina', 'Asma controlada desde la infancia.'),
    '72145689': ('A+', 'Ninguna', 'Sin antecedentes relevantes.'),
    '10456782': ('B+', 'Ibuprofeno', 'Migrañas ocasionales.'),
    '45678912': ('AB+', 'Ninguna', 'Hipertensión controlada.'),
    '73456128': ('O-', 'Ninguna', 'Sin antecedentes relevantes.'),
    '61234578': ('A-', 'Sulfamidas', 'Diabetes tipo 2 en tratamiento.'),
    '84567123': ('B-', 'Ninguna', 'Sin antecedentes relevantes.'),
    '52346789': ('O+', 'Ninguna', 'Operación de rodilla en 2021.'),
}


class Command(BaseCommand):
    help = 'Carga especialidades, médicos, pacientes, historias y citas de ejemplo.'

    @transaction.atomic
    def handle(self, *args, **options):
        for nombre, descripcion in ESPECIALIDADES:
            Especialidad.objects.update_or_create(
                nombre=nombre,
                defaults={'descripcion': descripcion},
            )

        for nombres, cmp, especialidad, telefono, correo in MEDICOS:
            Medico.objects.update_or_create(
                cmp=cmp,
                defaults={
                    'nombres': nombres,
                    'especialidad': Especialidad.objects.get(nombre=especialidad),
                    'telefono': telefono,
                    'correo': correo,
                },
            )

        for dni, nombres, fecha_nacimiento, telefono, correo in PACIENTES:
            Paciente.objects.update_or_create(
                dni=dni,
                defaults={
                    'nombres': nombres,
                    'fecha_nacimiento': fecha_nacimiento,
                    'telefono': telefono,
                    'correo': correo,
                },
            )
            grupo, alergias, antecedentes = HISTORIAS[dni]
            HistoriaClinica.objects.update_or_create(
                paciente=Paciente.objects.get(dni=dni),
                defaults={
                    'grupo_sanguineo': grupo,
                    'alergias': alergias,
                    'antecedentes': antecedentes,
                },
            )

        fecha_base = timezone.localdate()
        citas_demo = [
            ('45871236', 'CMP 045871', fecha_base + timedelta(days=1), time(9, 0), 'Control pediátrico', 'pendiente'),
            ('72145689', 'CMP 052340', fecha_base + timedelta(days=1), time(9, 0), 'Evaluación cardiológica', 'confirmada'),
            ('10456782', 'CMP 061205', fecha_base + timedelta(days=1), time(10, 30), 'Revisión de lunar', 'pendiente'),
            ('45678912', 'CMP 038914', fecha_base + timedelta(days=2), time(8, 30), 'Chequeo general', 'atendida'),
            ('73456128', 'CMP 047782', fecha_base + timedelta(days=2), time(10, 0), 'Control de crecimiento', 'confirmada'),
            ('61234578', 'CMP 055610', fecha_base + timedelta(days=2), time(11, 0), 'Control de presión arterial', 'cancelada'),
            ('84567123', 'CMP 045871', fecha_base + timedelta(days=3), time(9, 30), 'Vacunación', 'pendiente'),
            ('52346789', 'CMP 038914', fecha_base + timedelta(days=3), time(11, 30), 'Dolor lumbar', 'confirmada'),
        ]

        for dni, cmp, fecha, hora, motivo, estado in citas_demo:
            Cita.objects.get_or_create(
                medico=Medico.objects.get(cmp=cmp),
                fecha=fecha,
                hora=hora,
                defaults={
                    'paciente': Paciente.objects.get(dni=dni),
                    'motivo': motivo,
                    'estado': EstadoCita.objects.get(nombre=estado),
                },
            )

        self.stdout.write(
            self.style.SUCCESS(
                'Datos demo cargados: '
                f'{Especialidad.objects.count()} especialidades, '
                f'{Medico.objects.count()} médicos, '
                f'{Paciente.objects.count()} pacientes, '
                f'{Cita.objects.count()} citas.'
            )
        )
