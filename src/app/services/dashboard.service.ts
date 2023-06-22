import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }
  isDateProperty(property: string): boolean {
    return property.includes('/');
  }

  calculateHighestState(data: any[]): string {
    let maxDeaths = 0;
    let highestState = '';

    for (const row of data) {
      for (const key in row) {
        // Verificar si la propiedad es una fecha
        if (this.isDateProperty(key)) {
          const deaths = parseInt(row[key]);

          // Verificar si el valor es un número válido
          if (!isNaN(deaths) && deaths > maxDeaths) {
            maxDeaths = deaths;
            highestState = row['Province_State'];
          }
        }
      }
    }

    return highestState;
  }


  calculateLowestState(data: any[]): string {
    let minDeaths = Infinity;
    let lowestState = '';

    for (const row of data) {
      for (const key in row) {
        if (this.isDateProperty(key)) {
          const deaths = parseInt(row[key]);
          if (deaths < minDeaths) {
            minDeaths = deaths;
            lowestState = row['Province_State'];
          }
        }
      }
    }

    return lowestState;
  }
  calculateMostAffectedState(data: any[]): string {
    let maxAffected = 0;
    let mostAffectedState = '';

    for (const row of data) {
      for (const key in row) {
        if (this.isDateProperty(key)) {
          const affected = parseInt(row[key]);
          if (affected > maxAffected) {
            maxAffected = affected;
            mostAffectedState = row['Province_State'];
          }
        }
      }
    }

    return mostAffectedState;
  }
  calculateTotalDeaths(data: any[]): Map<string, number> {
    const totalDeathsByState = new Map<string, number>();

    for (const row of data) {
      const state = row["Province_State"];

      // Verificar si el estado es un valor válido
      if (state) {
        for (const key in row) {
          // Verificar si la propiedad es una fecha
          if (this.isDateProperty(key)) {
            const deaths = parseInt(row[key]);

            // Verificar si el valor es un número válido
            if (!isNaN(deaths)) {
              // Verificar si el estado ya existe en el mapa
              if (totalDeathsByState.has(state)) {
                // Obtener el total de muertes actual del estado
                const currentDeaths = totalDeathsByState.get(state);

                // Verificar si el total de muertes actual no es undefined
                if (currentDeaths !== undefined) {
                  // Sumar el total de muertes actual con las nuevas muertes del estado
                  totalDeathsByState.set(state, currentDeaths + deaths);
                }
              } else {
                // Agregar un nuevo estado y su total de muertes al mapa
                totalDeathsByState.set(state, deaths);
              }
            }
          }
        }
      }
    }

    return totalDeathsByState;
  }
  calculateTotalPopulation(data: any[]): Map<string, number> {
    const totalPopulationByState = new Map<string, number>();

    for (const row of data) {
      const state = row["Province_State"];
      const population = parseInt(row["Population"]);

      // Verificar si el estado y la población son valores válidos
      if (state && !isNaN(population)) {
        // Verificar si el estado ya existe en el mapa
        if (totalPopulationByState.has(state)) {
          // Obtener la población actual del estado
          const currentPopulation = totalPopulationByState.get(state);

          // Verificar si la población actual no es undefined
          if (currentPopulation !== undefined) {
            // Sumar la población actual con la nueva población del estado
            totalPopulationByState.set(state, currentPopulation + population);
          }
        } else {
          // Agregar un nuevo estado y su población al mapa
          totalPopulationByState.set(state, population);
        }
      }
    }

    return totalPopulationByState;
  }
  calculatePercentage(deaths: Map<string, number>, population: Map<string, number>): number[] {
    const percentages: number[] = [];
    population.forEach((value, key) => {
      const stateDeaths = deaths.get(key) || 0; // Obtener el número de muertes del estado
      const percentage = (stateDeaths / value) * 100;
      percentages.push(percentage);
    });
    return percentages;
  }
}
