from django.db import models


# Aqui criamos a "tabela" Empresa no banco de dados
class Empresa(models.Model):
    # Nome da empresa (não pode repetir e tem limite de 120 caracteres)
    nome = models.CharField(max_length=120, unique=True)

    # Status da empresa (ativo ou inativo).
    # Começa como True, mas pode ser alterado no futuro.
    status = models.BooleanField(default=True)

    # Diz se a empresa tem armazém (True ou False)
    armazem = models.BooleanField(default=False)

    # Indica se tem conectividade (padrão é False aqui, você pode mudar para True se quiser)
    conectividade = models.BooleanField(default=False)

    # Configurações extras
    class Meta:
        # Sempre que buscar empresas, elas vão vir em ordem pelo nome
        ordering = ["nome"]

    # Isso faz com que, quando mostrar uma empresa como texto, apareça só o nome dela
    def __str__(self):
        return self.nome
