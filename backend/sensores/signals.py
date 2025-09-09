from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from .models import Sensor
from armazens.models import Armazem
from empresas.models import Empresa


# Guarda armazém antigo quando sensor é movido
@receiver(pre_save, sender=Sensor)
def _store_old_armazem(sender, instance, **kwargs):
    if not instance.pk:
        instance._old_armazem_id = None
    else:
        try:
            old = Sensor.objects.get(pk=instance.pk)
            instance._old_armazem_id = old.armazem_id
        except Sensor.DoesNotExist:
            instance._old_armazem_id = None


def _recontar(armazem_id: int | None):
    if not armazem_id:
        return
    try:
        a = Armazem.objects.get(pk=armazem_id)
    except Armazem.DoesNotExist:
        return

    # Atualiza qtd_sensores
    total = a.sensores.count()
    if a.qtd_sensores != total:
        Armazem.objects.filter(pk=a.pk).update(qtd_sensores=total)

    # Atualiza flag de empresa: possui armazém
    empresa = a.empresa
    possui_armazem = empresa.armazens.exists()
    if empresa.armazem != possui_armazem:
        Empresa.objects.filter(pk=empresa.pk).update(armazem=possui_armazem)


@receiver(post_save, sender=Sensor)
def _on_sensor_save(sender, instance, created, **kwargs):
    _recontar(instance.armazem_id)
    if hasattr(instance, "_old_armazem_id") and instance._old_armazem_id and instance._old_armazem_id != instance.armazem_id:
        _recontar(instance._old_armazem_id)


@receiver(post_delete, sender=Sensor)
def _on_sensor_delete(sender, instance, **kwargs):
    _recontar(instance.armazem_id)
