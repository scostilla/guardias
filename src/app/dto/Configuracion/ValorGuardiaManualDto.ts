export class ValorGuardiaManualDto {
  tipoGuardia: string;   // Enum que hay que crear también
  nivelComplejidad: number;
  totalLav: number;               // BigDecimal se mapea a number
  totalSdf: number;               // BigDecimal se mapea a number
  fechaInicio: Date;            // LocalDate se mapea a string ISO (yyyy-MM-dd)
  idsHospitales?: number[];       // Lista opcional de IDs de hospitales
  
  constructor(
        tipoGuardia: string,   // Enum que hay que crear también
        nivelComplejidad: number,
        totalLav: number,               // BigDecimal se mapea a number
        totalSdf: number,               // BigDecimal se mapea a number
        fechaInicio: Date,            // LocalDate se mapea a string ISO (yyyy-MM-dd)
        idsHospitales?: number[],       // Lista opcional de IDs de hospitales
    ) {
        this.tipoGuardia = tipoGuardia;
        this.nivelComplejidad = nivelComplejidad;
        this.totalLav = totalLav;
        this.totalSdf = totalSdf;
        this.fechaInicio = fechaInicio;
        this.idsHospitales = idsHospitales;
    }
}