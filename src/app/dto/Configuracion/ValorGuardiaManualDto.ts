export class ValorGuardiaManualDto {
  tipoGuardia: string;   // Enum que hay que crear también
  nivelComplejidad: number;
  totalLav?: number;               // BigDecimal se mapea a number
  totalSdf?: number;               // BigDecimal se mapea a number
  fechaInicio: Date;            // LocalDate se mapea a string ISO (yyyy-MM-dd)
  idsHospitales?: number[];       // Lista opcional de IDs de hospitales
  decreto1178Lav?: number;
  decreto1178Sdf?: number;

  decreto1657Lav?: number;
  decreto1657Sdf?: number;
  resolucion2575Lav?: number;
  resolucion2575Sdf?: number;

  bono1580Lav?: number;
  bono1580Sdf?: number;

  constructor(
        tipoGuardia: string,   // Enum que hay que crear también
        nivelComplejidad: number,
        fechaInicio: Date,            // LocalDate se mapea a string ISO (yyyy-MM-dd)
        totalLav?: number,               // BigDecimal se mapea a number
        totalSdf?: number,               // BigDecimal se mapea a number
        idsHospitales?: number[],       // Lista opcional de IDs de hospitales

        decreto1178Lav?: number,
        decreto1178Sdf?: number,

        decreto1657Lav?: number,
        decreto1657Sdf?: number,

        resolucion2575Lav?: number,
        resolucion2575Sdf?: number,

        bono1580Lav?: number,
        bono1580Sdf?: number,
    ) {
        this.tipoGuardia = tipoGuardia;
        this.nivelComplejidad = nivelComplejidad;
        this.totalLav = totalLav;
        this.totalSdf = totalSdf;
        this.fechaInicio = fechaInicio;
        this.idsHospitales = idsHospitales;
        this.decreto1178Lav = decreto1178Lav;
        this.decreto1178Sdf = decreto1178Sdf;
        this.decreto1657Lav = decreto1657Lav;
        this.decreto1657Sdf = decreto1657Sdf;
        this.resolucion2575Lav = resolucion2575Lav;
        this.resolucion2575Sdf = resolucion2575Sdf;
        this.bono1580Lav = bono1580Lav;
        this.bono1580Sdf = bono1580Sdf;
    }
}