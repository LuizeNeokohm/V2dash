from rest_framework import serializers
from .models import Armazem

class ArmazemSerializer(serializers.ModelSerializer):
    # Mostrar o nome da empresa além do ID
    empresa_nome = serializers.CharField(source='empresa.nome', read_only=True)

    class Meta:
        model = Armazem
        fields = [
            'id',
            'empresa',      # id da empresa
            'empresa_nome', # nome da empresa
            'nome',
            'qtd_sensores', # somente leitura
            'gateway_id',
            'latitude',
            'longitude',
            'data_instalacao',
            'instalador',
        ]
        read_only_fields = ['qtd_sensores']

    def validate(self, data):
        # Pega latitude e longitude enviadas ou atuais
        lat = data.get('latitude', getattr(self.instance, 'latitude', None))
        lon = data.get('longitude', getattr(self.instance, 'longitude', None))

        # Valida latitude
        if lat is not None and (lat < -90 or lat > 90):
            raise serializers.ValidationError({"latitude": "Deve estar entre -90 e 90."})

        # Valida longitude
        if lon is not None and (lon < -180 or lon > 180):
            raise serializers.ValidationError({"longitude": "Deve estar entre -180 e 180."})

        return data
