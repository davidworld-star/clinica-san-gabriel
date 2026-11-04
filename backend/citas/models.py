from django.core.validators import RegexValidator
from django.db import models


# El DNI peruano tiene exactamente 8 dígitos.
validador_dni = RegexValidator(
    regex=r'^\d{8}$',
    message='El DNI debe tener exactamente 8 dígitos.',
)


class Especialidad(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)

    class Meta:
        ordering = ['nombre']
        verbose_name = 'especialidad'
        verbose_name_plural = 'especialidades'

    def __str__(self):
        return self.nombre


class Medico(models.Model):
    nombres = models.CharField(max_length=150)
    cmp = models.CharField('CMP', max_length=20, unique=True)
    especialidad = models.ForeignKey(
        Especialidad,
        on_delete=models.PROTECT,
        related_name='medicos',
    )
    telefono = models.CharField(max_length=15, blank=True)
    correo = models.EmailField(blank=True)

    class Meta:
        ordering = ['nombres']
        verbose_name = 'médico'
        verbose_name_plural = 'médicos'

    def __str__(self):
        return f'Dr(a). {self.nombres} - {self.especialidad.nombre}'


class Paciente(models.Model):
    dni = models.CharField(
        'DNI',
        max_length=8,
        unique=True,
        validators=[validador_dni],
    )
    nombres = models.CharField(max_length=150)
    fecha_nacimiento = models.DateField()
    telefono = models.CharField(max_length=15, blank=True)
    correo = models.EmailField(blank=True)

    class Meta:
        ordering = ['nombres']
        verbose_name = 'paciente'
        verbose_name_plural = 'pacientes'

    def __str__(self):
        return f'{self.nombres} ({self.dni})'


class EstadoCita(models.Model):
    nombre = models.CharField(max_length=30, unique=True)
    es_final = models.BooleanField(default=False)

    class Meta:
        ordering = ['nombre']
        verbose_name = 'estado de cita'
        verbose_name_plural = 'estados de cita'

    def __str__(self):
        return self.nombre


class Cita(models.Model):
    paciente = models.ForeignKey(
        Paciente,
        on_delete=models.PROTECT,
        related_name='citas',
    )
    medico = models.ForeignKey(
        Medico,
        on_delete=models.PROTECT,
        related_name='citas',
    )
    fecha = models.DateField()
    hora = models.TimeField()
    motivo = models.TextField()
    estado = models.ForeignKey(
        EstadoCita,
        on_delete=models.PROTECT,
        related_name='citas',
    )

    class Meta:
        ordering = ['fecha', 'hora']
        verbose_name = 'cita'
        verbose_name_plural = 'citas'
        constraints = [
            models.UniqueConstraint(
                fields=['medico', 'fecha', 'hora'],
                name='cita_medico_fecha_hora_unica',
            ),
        ]

    def __str__(self):
        return (
            f'{self.paciente.nombres} con {self.medico.nombres} '
            f'el {self.fecha:%d/%m/%Y} a las {self.hora:%H:%M}'
        )


class HistoriaClinica(models.Model):
    GRUPOS_SANGUINEOS = [
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    ]

    paciente = models.OneToOneField(
        Paciente,
        on_delete=models.CASCADE,
        related_name='historia_clinica',
    )
    grupo_sanguineo = models.CharField(
        max_length=3,
        choices=GRUPOS_SANGUINEOS,
    )
    alergias = models.TextField(blank=True)
    antecedentes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'historia clínica'
        verbose_name_plural = 'historias clínicas'

    def __str__(self):
        return f'Historia clínica de {self.paciente.nombres}'
