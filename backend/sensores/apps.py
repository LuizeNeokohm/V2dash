from django.apps import AppConfig


class SensoresConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sensores'

    def ready(self):
        from . import signals  # garante o registro dos signals
