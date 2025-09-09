from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Sensor
from .serializers import SensorSerializer
from armazens.models import Armazem
from armazens.serializers import ArmazemSerializer

class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.select_related('armazem').all().order_by('-created_at')
    serializer_class = SensorSerializer
    filterset_fields = ['id', 'armazem', 'faixa_temp']
    search_fields = ['id', 'nome']
    ordering_fields = ['id', 'data_inst', 'created_at']
    ordering = ['-created_at']

    @action(detail=False, methods=['get'])
    def resumo(self, request):
        """Resumo de sensores por armazém"""
        data = self.queryset.values('armazem__nome').annotate(total=Count('id'))
        return Response(data)

    @action(detail=False, methods=['get'])
    def armazens(self, request):
        """Lista de armazéns para select"""
        armazens = Armazem.objects.filter(empresa__isnull=False)
        serializer = ArmazemSerializer(armazens, many=True)
        return Response(serializer.data or [])
