from rest_framework import serializers
from .models import Empresa

class EmpresaSerializer(serializers.ModelSerializer):
    qtd_armazens = serializers.SerializerMethodField()

    class Meta:
        model = Empresa
        fields = [
            'id',
            'nome',
            'status',
            'armazem',
            'conectividade',
            'qtd_armazens',  # novo campo
        ]

    def get_qtd_armazens(self, obj):
        return obj.armazens.count()  # usa o related_name='armazens' do Armazem
