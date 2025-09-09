from django.apps import AppConfig


# Aqui configuramos a app "armazens"
class ArmazensConfig(AppConfig):
    # Diz para o Django usar BigAutoField como tipo padrão para os IDs das tabelas
    default_auto_field = 'django.db.models.BigAutoField'

    # Nome da app (tem que ser igual à pasta onde está o app)
    name = 'armazens'

    # O método ready() é chamado quando a app é carregada
    # É útil para rodar códigos que precisam estar ativos assim que o Django inicia
    def ready(self):
        # Importa os signals da app
        # Signals são "avisos" que dizem ao Django: "quando algo acontecer com um modelo, faça isso"
        from . import signals  # noqa
