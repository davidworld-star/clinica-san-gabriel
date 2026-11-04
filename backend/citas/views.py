from django.db.models.deletion import ProtectedError
from django.utils.dateparse import parse_date
from rest_framework import status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import Cita, Especialidad, EstadoCita, HistoriaClinica, Medico, Paciente
from .serializers import (
    CitaSerializer,
    EspecialidadSerializer,
    EstadoCitaSerializer,
    HistoriaClinicaSerializer,
    MedicoSerializer,
    PacienteSerializer,
)


class ProteccionAlEliminarMixin:
    """Convierte ProtectedError en una respuesta 409 entendible."""

    mensaje_protegido = 'No se puede eliminar el registro porque tiene datos relacionados.'

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {'detail': self.mensaje_protegido},
                status=status.HTTP_409_CONFLICT,
            )


class EspecialidadViewSet(ProteccionAlEliminarMixin, viewsets.ModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer
    mensaje_protegido = (
        'No se puede eliminar la especialidad porque tiene médicos asociados.'
    )


class MedicoViewSet(ProteccionAlEliminarMixin, viewsets.ModelViewSet):
    serializer_class = MedicoSerializer
    mensaje_protegido = (
        'No se puede eliminar el médico porque tiene citas registradas.'
    )

    def get_queryset(self):
        queryset = Medico.objects.select_related('especialidad').all()
        especialidad = self.request.query_params.get('especialidad')
        if especialidad:
            if not especialidad.isdigit():
                raise ValidationError(
                    {'especialidad': 'El filtro debe ser un ID numérico.'}
                )
            queryset = queryset.filter(especialidad_id=int(especialidad))
        return queryset


class PacienteViewSet(ProteccionAlEliminarMixin, viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    mensaje_protegido = (
        'No se puede eliminar el paciente porque tiene citas registradas.'
    )


class EstadoCitaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EstadoCita.objects.all()
    serializer_class = EstadoCitaSerializer


class CitaViewSet(viewsets.ModelViewSet):
    serializer_class = CitaSerializer

    def get_queryset(self):
        queryset = Cita.objects.select_related(
            'paciente',
            'medico__especialidad',
            'estado',
        ).all()
        fecha = self.request.query_params.get('fecha')
        if fecha:
            fecha_parseada = parse_date(fecha)
            if fecha_parseada is None:
                raise ValidationError(
                    {'fecha': 'Use el formato de fecha AAAA-MM-DD.'}
                )
            queryset = queryset.filter(fecha=fecha_parseada)
        return queryset


class HistoriaClinicaViewSet(viewsets.ModelViewSet):
    queryset = HistoriaClinica.objects.select_related('paciente').all()
    serializer_class = HistoriaClinicaSerializer
