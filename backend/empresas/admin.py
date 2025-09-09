from django.contrib import admin
from .models import Empresa


# Isso aqui fala pro Django: "registre a tabela Empresa no painel admin"
@admin.register(Empresa)
class EmpresaAdmin(admin.ModelAdmin):
    # Quais colunas vão aparecer na listagem de empresas dentro do admin
    list_display = ('id','nome','status', 'armazem','conectividade')

    # Permite pesquisar empresas pelo nome no admin
    search_fields = ('nome',)

    # Adiciona filtros laterais (checkboxes) para filtrar por armazem ou conectividade
    list_filter = ('armazem','conectividade')
