export interface ICliente {
    id: string,
    nome?: string,
    cpf_cnpj?: string,
    data_nasc?: string,
    whatsapp?: string,
    telefone?: string,
    email?: string,
    profissao?: string,
    renda?: string,
    cofinanciado?: string,
    cofinanciador?: any,
    foto?: string,
    end_cep?: string,
    end_uf?: string,
    end_cidade?: string,
    end_bairro?: string,
    end_logradouro?: string,
    end_numero?: string,
    end_complemento?: string,
    url?: string,
    documentacao?: any,
    estado_civil?: string,
    tipo_compra?: string,
    preferencia?: any,
    favoritos?: any,
    recomendados?: any,
    hash?: string,
    created_at?: string,
    auth?: string
}