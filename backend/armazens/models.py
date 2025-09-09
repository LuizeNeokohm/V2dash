from django.db import models

class Armazem(models.Model):
    empresa = models.ForeignKey(
        'empresas.Empresa', 
        related_name='armazens', 
        on_delete=models.CASCADE
    )
    nome = models.CharField(max_length=120)
    qtd_sensores = models.PositiveIntegerField(default=0, editable=False)
    gateway_id = models.CharField(max_length=120)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    # Novo campo: data de instalação (informada pelo usuário)
    data_instalacao = models.DateField(verbose_name="Data de instalação")

    # Novo campo: nome do instalador
    instalador = models.CharField(max_length=120, verbose_name="Instalador")

    class Meta:
        unique_together = (("empresa", "nome"),)
        ordering = ["empresa__nome", "nome"]

    def __str__(self):
        return f"{self.nome} ({self.empresa.nome})"
