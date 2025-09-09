from django.db import models
from django.db.models import Q, F

class Sensor(models.Model):
    id = models.CharField(
        primary_key=True,
        max_length=64,
        help_text="Identificador único definido pelo usuário"
    )
    nome = models.CharField(max_length=120)
    data_inst = models.DateField(help_text="Data de instalação do sensor")
    faixa_temp = models.BooleanField(default=False, help_text="Se verdadeiro, exige valores mínima e máxima")
    minima = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    maxima = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    armazem = models.ForeignKey(
        'armazens.Armazem',
        related_name='sensores',
        on_delete=models.CASCADE
    )
    instalador_id = models.CharField(
        max_length=64,
        null=True,
        blank=True,
        help_text="ID do instalador enviado pelo front"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]
        constraints = [
            models.CheckConstraint(
                check=Q(faixa_temp=False) | (Q(minima__isnull=False) & Q(maxima__isnull=False)),
                name="sensor_faixa_temp_requires_min_max",
            ),
            models.CheckConstraint(
                check=Q(minima__isnull=True, maxima__isnull=True) | Q(minima__lte=F('maxima')),
                name="sensor_min_lte_max",
            ),
        ]

    def __str__(self):
        return f"{self.id} - {self.nome}"
