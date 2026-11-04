from django.contrib import admin

from .models import Cita, Especialidad, EstadoCita, HistoriaClinica, Medico, Paciente


@admin.register(Especialidad)
class EspecialidadAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'descripcion')
    search_fields = ('nombre', 'descripcion')
    ordering = ('nombre',)


@admin.register(Medico)
class MedicoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombres', 'cmp', 'especialidad', 'telefono', 'correo')
    search_fields = ('nombres', 'cmp', 'correo')
    list_filter = ('especialidad',)
    ordering = ('nombres',)


@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ('id', 'dni', 'nombres', 'fecha_nacimiento', 'telefono', 'correo')
    search_fields = ('dni', 'nombres', 'correo')
    list_filter = ('fecha_nacimiento',)
    ordering = ('nombres',)


@admin.register(EstadoCita)
class EstadoCitaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'es_final')
    search_fields = ('nombre',)
    list_filter = ('es_final',)
    ordering = ('nombre',)


@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'paciente',
        'medico',
        'fecha',
        'hora',
        'estado',
    )
    search_fields = ('paciente__nombres', 'medico__nombres', 'motivo')
    list_filter = ('estado', 'fecha', 'medico__especialidad')
    date_hierarchy = 'fecha'
    ordering = ('fecha', 'hora')


@admin.register(HistoriaClinica)
class HistoriaClinicaAdmin(admin.ModelAdmin):
    list_display = ('id', 'paciente', 'grupo_sanguineo')
    search_fields = ('paciente__nombres', 'paciente__dni')
    list_filter = ('grupo_sanguineo',)
    ordering = ('paciente__nombres',)
