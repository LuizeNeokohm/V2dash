from rest_framework import serializers
from .models import Sensor
from armazens.models import Armazem  # ✅ importa o modelo Armazem


# Serializer para lidar com listas de sensores
class ListSensorSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        sensores = [Sensor(**item) for item in validated_data]
        return Sensor.objects.bulk_create(sensores)


class SensorSerializer(serializers.ModelSerializer):
    armazem = serializers.PrimaryKeyRelatedField(queryset=Armazem.objects.all())

    class Meta:
        model = Sensor
        fields = [
            'id', 'nome', 'data_inst', 'faixa_temp',
            'minima', 'maxima', 'armazem', 'instalador_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
        list_serializer_class = ListSensorSerializer  # Permite enviar listas

    def validate(self, data):
        faixa = data.get('faixa_temp', getattr(self.instance, 'faixa_temp', False))
        minv = data.get('minima', getattr(self.instance, 'minima', None))
        maxv = data.get('maxima', getattr(self.instance, 'maxima', None))

        if faixa and (minv is None or maxv is None):
            raise serializers.ValidationError(
                "Quando 'faixa_temp' é verdadeiro, 'minima' e 'maxima' são obrigatórias."
            )
        if minv is not None and maxv is not None and minv > maxv:
            raise serializers.ValidationError("'minima' não pode ser maior que 'maxima'.")
        return data
