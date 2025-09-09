from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Armazem
from sensores.models import Sensor
from empresas.models import Empresa


# --- Atualiza flag de empresa ---
def _atualiza_flag_empresa(empresa_id: int):
    try:
        emp = Empresa.objects.get(pk=empresa_id)
    except Empresa.DoesNotExist:
        return

    possui = emp.armazens.exists()
    if emp.armazem != possui:
        Empresa.objects.filter(pk=emp.pk).update(armazem=possui)


@receiver(post_save, sender=Armazem)
def _on_armazem_save(sender, instance, created, **kwargs):
    _atualiza_flag_empresa(instance.empresa_id)


@receiver(post_delete, sender=Armazem)
def _on_armazem_delete(sender, instance, **kwargs):
    _atualiza_flag_empresa(instance.empresa_id)


# --- Atualiza qtd_sensores do armazém ---
def _atualiza_qtd_sensores(armazem_id: int):
    try:
        arm = Armazem.objects.get(pk=armazem_id)
    except Armazem.DoesNotExist:
        return

    qtd = arm.sensores.count()  # usa o related_name="sensores"
    if arm.qtd_sensores != qtd:
        Armazem.objects.filter(pk=arm.pk).update(qtd_sensores=qtd)


@receiver(post_save, sender=Sensor)
def _on_sensor_save(sender, instance, created, **kwargs):
    _atualiza_qtd_sensores(instance.armazem_id)


@receiver(post_delete, sender=Sensor)
def _on_sensor_delete(sender, instance, **kwargs):
    _atualiza_qtd_sensores(instance.armazem_id)
