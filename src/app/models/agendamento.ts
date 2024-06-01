export interface IAgendamento {
    id: string,
    id_anuncio?: string,
    id_cliente?: string,
    titulo_anuncio?: string,
    cod_anuncio?: string,
    nome_cliente?: string,
    dias?: string,
    horarios?: string,
    status?: string,
    historico?: any,
}