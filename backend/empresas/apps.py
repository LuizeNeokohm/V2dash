from django.apps import AppConfig

# Aqui configuramos o app "empresas"
class EmpresasConfig(AppConfig):
    # Define o tipo padrão de campo "id" das tabelas (vai ser BigAutoField = número grandão automático)
    default_auto_field = 'django.db.models.BigAutoField'

    # Nome do app (precisa ser igual à pasta onde ele está)
    name = 'empresas'
