from django.contrib import admin
from .models import Armazem

@admin.register(Armazem)
class ArmazemAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'empresa', 'qtd_sensores', 'gateway_id', 'data_instalacao', 'instalador')
    search_fields = ('nome','gateway_id')
    list_filter = ('empresa',)
