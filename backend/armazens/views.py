from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Armazem
from .serializers import ArmazemSerializer
from sensores.models import Sensor
from sensores.serializers import SensorSerializer

class ArmazemViewSet(viewsets.ModelViewSet):
    queryset = Armazem.objects.select_related('empresa').all()
    serializer_class = ArmazemSerializer
    filterset_fields = ['id', 'empresa', 'gateway_id']
    search_fields = ['nome', 'gateway_id']
    ordering_fields = ['nome', 'qtd_sensores']

    @action(detail=True, methods=['get'])
    def sensores(self, request, pk=None):
        qs = Sensor.objects.filter(armazem_id=pk).order_by('id')
        page = self.paginate_queryset(qs)
        ser = SensorSerializer(page or qs, many=True, context={'request': request})
        return self.get_paginated_response(ser.data) if page is not None else Response(ser.data)
