from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework import serializers

from .models import Cita, Especialidad, EstadoCita, HistoriaClinica, Medico, Paciente


class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = '__all__'


class MedicoSerializer(serializers.ModelSerializer):
    especialidad_nombre = serializers.CharField(
        source='especialidad.nombre',
        read_only=True,
    )

    class Meta:
        model = Medico
        fields = [
            'id',
            'nombres',
            'cmp',
            'especialidad',
            'especialidad_nombre',
            'telefono',
            'correo',
        ]


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'


class EstadoCitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoCita
        fields = '__all__'


class HistoriaClinicaSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.CharField(
        source='paciente.nombres',
        read_only=True,
    )

    class Meta:
        model = HistoriaClinica
        fields = [
            'id',
            'paciente',
            'paciente_nombre',
            'grupo_sanguineo',
            'alergias',
            'antecedentes',
        ]


class CitaSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.CharField(
        source='paciente.nombres',
        read_only=True,
    )
    medico_nombre = serializers.CharField(
        source='medico.nombres',
        read_only=True,
    )
    especialidad = serializers.CharField(
        source='medico.especialidad.nombre',
        read_only=True,
    )
    estado_nombre = serializers.CharField(
        source='estado.nombre',
        read_only=True,
    )
    estado_es_final = serializers.BooleanField(
        source='estado.es_final',
        read_only=True,
    )
    estado = serializers.PrimaryKeyRelatedField(
        queryset=EstadoCita.objects.all(),
        required=False,
    )

    class Meta:
        model = Cita
        fields = [
            'id',
            'paciente',
            'paciente_nombre',
            'medico',
            'medico_nombre',
            'especialidad',
            'fecha',
            'hora',
            'motivo',
            'estado',
            'estado_nombre',
            'estado_es_final',
        ]
        # Desactivamos el validador automático del UniqueConstraint para
        # responder con nuestro propio mensaje desde validate().
        validators = []

    def validate(self, attrs):
        fecha = attrs.get('fecha', getattr(self.instance, 'fecha', None))
        hora = attrs.get('hora', getattr(self.instance, 'hora', None))
        medico = attrs.get('medico', getattr(self.instance, 'medico', None))

        # La regla de fecha pasada solo se aplica al crear o al cambiar
        # fecha/hora. Así un PATCH que solo cambia el estado no falla.
        debe_validar_fecha = self.instance is None or (
            'fecha' in attrs or 'hora' in attrs
        )
        if debe_validar_fecha and fecha and hora:
            hoy = timezone.localdate()
            ahora = timezone.localtime().time()
            if fecha < hoy:
                raise serializers.ValidationError(
                    {'fecha': 'No se puede registrar una cita en una fecha pasada.'}
                )
            if fecha == hoy and hora < ahora:
                raise serializers.ValidationError(
                    {'hora': 'La hora seleccionada ya pasó.'}
                )

        if medico and fecha and hora:
            citas_ocupadas = Cita.objects.filter(
                medico=medico,
                fecha=fecha,
                hora=hora,
            )
            if self.instance is not None:
                citas_ocupadas = citas_ocupadas.exclude(pk=self.instance.pk)
            if citas_ocupadas.exists():
                raise serializers.ValidationError(
                    {
                        'non_field_errors': [
                            (
                                'El médico ya tiene una cita el '
                                f'{fecha:%d/%m/%Y} a las {hora:%H:%M}.'
                            )
                        ]
                    }
                )

        if self.instance is None and not attrs.get('estado'):
            estado_pendiente = EstadoCita.objects.filter(nombre='pendiente').first()
            if estado_pendiente is None:
                raise serializers.ValidationError(
                    {'estado': 'No existe el estado inicial "pendiente".'}
                )
            attrs['estado'] = estado_pendiente

        return attrs

    def create(self, validated_data):
        try:
            with transaction.atomic():
                return super().create(validated_data)
        except IntegrityError as error:
            raise serializers.ValidationError(
                {
                    'non_field_errors': [
                        'El médico ya tiene una cita en ese horario.'
                    ]
                }
            ) from error

    def update(self, instance, validated_data):
        try:
            with transaction.atomic():
                return super().update(instance, validated_data)
        except IntegrityError as error:
            raise serializers.ValidationError(
                {
                    'non_field_errors': [
                        'El médico ya tiene una cita en ese horario.'
                    ]
                }
            ) from error
