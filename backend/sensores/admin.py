from django.contrib import admin
from .models import Sensor


@admin.register(Sensor)
class SensorAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'armazem', 'faixa_temp', 'minima', 'maxima', 'data_inst', 'created_at')
    search_fields = ('id', 'nome')
    list_filter = ('faixa_temp', 'armazem')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
