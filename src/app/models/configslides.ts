import { SwiperOptions } from "swiper/types"
import { ESlides } from "../enums/slides"

export interface IConfigSlides {
    titulo: string,
    subtitulo?:string,
    tipo: ESlides
    start: number
    end: number,
    breakpoints?: SwiperOptions['breakpoints']

}