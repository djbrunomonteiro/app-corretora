import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  categorias = [
    'comprar',
    'alugar',
    'trocar'
  ];

  tipos = ['apartamento', 'casa' , 'casa de vila', 'casa de condomínio','Lançamentos casas', 'Lançamentos apartamentos', 'cobertura', 'duplex', 'flat', 'galpão', 'hotel', 'imóvel de recreação', 'loja', 'kitnets', 'restaurante', 'sítio', 'sala comercial', 'sobrado', 'chácara', 'terreno/lotes']
  areasComuns = [
    "Portaria",
    "Hall de entrada",
    "Áreas de circulação",
    "Elevadores",
    "Salão de festas",
    "Churrasqueira",
    "Piscina",
    "Quadra poliesportiva",
    "Playground",
    "Espaço gourmet",
    "Espaço fitness",
    "Espaço pet",
    "Lavanderia compartilhada",
    "Garagem",
    "Salão de jogos",
    "Sala de cinema",
    "Espaço coworking",
    "Espaço para eventos",
    "Espaço para festas infantil"
   ];

   areasImovel = [
    "Sala de estar",
    "Sala de jantar",
    "Cozinha",
    "Lavanderia",
    "Banheiros",
    "Quartos",
    "Varanda",
    "Quintal",
    "Sacada",
    "Terraço",
    "Área de serviço",
    "Escritório",
    "Home office",
    "Closet",
    "Despensa",
    "Garagem"
  ];

  itensProximos = [
    "Parque",
    "Praça",
    "Jardim",
    "Escola",
    "Hospital",
    "Supermercado",
    "Banco",
    "Restaurante",
    "Lojas",
    "Transporte público",
    "Vias de acesso",
    "Centro comercial",
    "Pontos turísticos"
  ];

  itensAdicionais = [
    "Depósito",
    "Guarita",
    "Manobrista",
    "Portão eletrônico",
    "Alarme",
    "Sistema de câmeras",
    "Piscina aquecida",
    "Churrasqueira a gás",
    "Jardim",
    "Horta",
    "Vista privilegiada",
    "Arquitetura moderna",
    "Decoração de alto padrão",
    "Imóvel reformado",
    "Imóvel novo",
    "Imóvel com potencial de valorização"
  ];

  orders = [
    "menor valor",
    "maior valor",
    "mais recentes",
    "menos recentes",
  ];

  diasSemana = [
    'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
  ];

  modalidade_finan = ['individual', 'cofinanciado', 'outro'];
  tipo_cliente = ['principal', 'cofinanciador'];
  tipo_arquivo= [
    "CNH",
    "RG",
    "Certidão de nascimento",
    "Certidão de casamento",
    "Comprovante de residência",
    "Holerites/Contracheques",
    "Extrato bancário",
    "Extrato FGTS",
    "Outros"
  ]
  nums: number[] = [];
  acceptedCookies$ = new BehaviorSubject('')

  constructor(
    private ssrCookieService: SsrCookieService,
    private title: Title,
    @Inject(PLATFORM_ID) public platformId: Object
  ) { 
    this.generateNums()
  }

  setTitle(value: string){
    if(isPlatformBrowser(this.platformId)){
      this.title.setTitle(value)
    }
  }

  updateMeta(description: string, keys: string) {
    if(isPlatformBrowser(this.platformId)){
      const metaTags = document.head.querySelectorAll('meta');
      metaTags.forEach(tag => {
        if (tag.name === 'description') {
          tag.setAttribute('content', description)
        }
        if (tag.name === 'keywords') {
          tag.setAttribute('content', keys)
        }
      })
    }

  }

  generateNums(){
    for (let index = 0; index <= 100; index++) {
      this.nums.push(index)
    }

  }

  getAcceptedCookies(){
    const res = this.ssrCookieService.get('acceptedCookies') ?? '';
    this.acceptedCookies$.next(res);
  }

  setAcceptedCookies(value: string){
    this.ssrCookieService.set('acceptedCookies', value);
    this.acceptedCookies$.next(value);
  }
}
