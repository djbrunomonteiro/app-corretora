export interface IAnuncio {
    id?: string,
    codigo?: string,
    titulo?: string,
    categoria?: string,
    tipo?: string,
    fotos?: string[],
    tour_virtual?: any,
    preco?: number,
    iptu?: number,
    condominio?: number,
    area_util?: number,
    qtd_dorm?: number,
    qtd_ban?: number,
    qtd_suite?: number,
    qtd_vaga?: number,
    dets_imovel?: string[],
    dets_area_comun?: string[],
    dets_proximidades: string[],
    dets_outros?: string[],
    end_cidade?: string,
    end_uf?: string,
    end_logradouro?: string,
    end_numero?: string,
    end_bairro?: string,
    end_complemento?: string,
    url?: string,
    status?: string,
    created_at?: string

}

