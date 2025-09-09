from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Empresa
from .serializers import EmpresaSerializer
from armazens.models import Armazem
from armazens.serializers import ArmazemSerializer

class EmpresaViewSet(viewsets.ModelViewSet):
    
    #pega todas as empresas do banco de dados e organiza pelo nome
    queryset = Empresa.objects.all().order_by('nome')
    
    # Esse é o tradutor que transforma os dados de Empresa em JSON
    serializer_class = EmpresaSerializer
    # Esses são os filtros que podemos usar na URL (ex: ?id=1)
    filterset_fields = ['id', 'armazem', 'conectividade']
    
    # Podemos procurar empresas pelo nome (ex: ?search=Carrefour)
    search_fields = ['nome']
    
    # Podemos ordenar pelos campos nome
    ordering_fields = ['nome']

    # Criamos uma ação nova chamada "armazens"
    # Ela vai mostrar os armazéns de uma empresa específica
    @action(detail=True, methods=['get'])
    def armazens(self, request, pk=None):
        # Procura todos os armazéns que pertencem à empresa com esse "pk" (id)
        qs = Armazem.objects.filter(empresa_id=pk).order_by('nome')

        # Se tiver paginação, pega só uma parte (página) dos armazéns
        page = self.paginate_queryset(qs)

        # Traduz os armazéns para JSON
        ser = ArmazemSerializer(page or qs, many=True, context={'request': request})

        # Se tiver página, devolve a página com os armazéns
        # Senão, devolve todos os armazéns
        return self.get_paginated_response(ser.data) if page is not None else Response(ser.data)