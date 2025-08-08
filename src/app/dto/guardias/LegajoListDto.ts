import { RevistaListDto } from './RevistaListDto';

export class LegajoListDto {
    revista: RevistaListDto; 

        constructor (
            revista: RevistaListDto,
                ){
            this.revista = revista;
        }
    }
