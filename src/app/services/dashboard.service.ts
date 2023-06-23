import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }
  //Analizar si es una fecha
  isDateProperty(property: string): boolean {
    return property.includes('/');
  }
  //Calcular el estado con mayor acumulado
  calculateHighestState(data: any[]): string {
    const stateDeathsMap: Map<string, number> = new Map();
  
    for (const row of data) {
      const state = row['Province_State'];
      const city = row['Admin2'];
  
      // Verificar si la propiedad es una fecha
      for (const key in row) {
        if (this.isDateProperty(key)) {
          const deaths = parseInt(row[key]);
  
          // Verificar si el valor es un número válido
          if (!isNaN(deaths)) {
            const location = city ? `${state},${city}` : state; // Construir la ubicación (estado o estado-ciudad)
            const currentDeaths = stateDeathsMap.get(location) || 0; // Obtener el total de muertes actual de la ubicación
  
            // Sumar el total de muertes actual con las nuevas muertes
            stateDeathsMap.set(location, currentDeaths + deaths);
          }
        }
      }
    }
  
    let highestState = '';
    let maxDeaths = 0;
  
    // Encontrar la ubicación con el mayor número de muertes
    stateDeathsMap.forEach((deaths, location) => {
      if (deaths > maxDeaths) {
        maxDeaths = deaths;
        highestState = location;
      }
    });
  
    // Si la ubicación contiene una coma (estado-ciudad), se extrae solo el estado
    if (highestState.includes(',')) {
      const [state, _] = highestState.split(',');
      highestState = state;
    }
  
    return highestState;
  }

// Calcular el estado con menor acumulado
calculateLowestState(data: any[]): string {
  const stateDeathsMap: Map<string, number> = new Map();

  for (const row of data) {
    const state = row['Province_State'];
    const city = row['Admin2'];

    // Verificar si la propiedad es una fecha
    for (const key in row) {
      if (this.isDateProperty(key)) {
        const deaths = parseInt(row[key]);

        // Verificar si el valor es un número válido
        if (!isNaN(deaths)) {
          const location = city ? `${state},${city}` : state; // Construir la ubicación (estado o estado-ciudad)
          const currentDeaths = stateDeathsMap.get(location) || 0; // Obtener el total de muertes actual de la ubicación

          // Sumar el total de muertes actual con las nuevas muertes
          stateDeathsMap.set(location, currentDeaths + deaths);
        }
      }
    }
  }

  let lowestState = '';
  let minDeaths = Infinity;

  // Encontrar la ubicación con el menor número de muertes
  stateDeathsMap.forEach((deaths, location) => {
    if (deaths < minDeaths) {
      minDeaths = deaths;
      lowestState = location;
    }
  });

  // Si la ubicación contiene una coma (estado-ciudad), se extrae solo el estado
  if (lowestState.includes(',')) {
    const [state, _] = lowestState.split(',');
    lowestState = state;
  }

  return lowestState;
}

// Calcular el estado más afectado
calculateMostAffectedState(data: any[]): string {
  const stateAffectedMap: Map<string, number> = new Map();
  const statePopulationMap: Map<string, number> = new Map();

  for (const row of data) {
    const state = row['Province_State'];
    const city = row['Admin2'];
    const population = parseInt(row['Population']);

    // Verificar si la propiedad es una fecha
    for (const key in row) {
      if (this.isDateProperty(key)) {
        const affected = parseInt(row[key]);

        // Verificar si el valor es un número válido
        if (!isNaN(affected)) {
          const location = city ? `${state},${city}` : state; // Construir la ubicación (estado o estado-ciudad)
          const currentAffected = stateAffectedMap.get(location) || 0; // Obtener el total afectado actual de la ubicación

          // Sumar el total afectado actual con los nuevos afectados
          stateAffectedMap.set(location, currentAffected + affected);

          if (statePopulationMap.has(state)) {
            // Sumar la población actual del estado con la población de la ubicación
            statePopulationMap.set(state, (statePopulationMap.get(state) ?? 0) + population);
          } else {
            // Agregar el estado y su población al mapa
            statePopulationMap.set(state, population);
          }
        }
      }
    }
  }

  let mostAffectedState = '';
  let maxAffectedRate = 0;

  // Calcular la tasa de afectados por estado
  stateAffectedMap.forEach((affected, location) => {
    const [state, _] = location.split(',');
    const population = statePopulationMap.get(state) || 0;
    const affectedRate = (affected / population) * 100;

    if (affectedRate > maxAffectedRate) {
      maxAffectedRate = affectedRate;
      mostAffectedState = state;
    }
  });

  return mostAffectedState;
}

// Calcular el número total de muertes por estado
calculateTotalDeaths(data: any[]): Map<string, number> {
  const totalDeathsByState = new Map<string, number>();
  const statePopulationMap = new Map<string, number>();

  for (const row of data) {
    const state = row["Province_State"];

    // Verificar si el estado es un valor válido
    if (state) {
      const population = parseInt(row["Population"]) || 0; // Obtener la población total del estado

      // Verificar si el estado ya existe en el mapa de población
      if (statePopulationMap.has(state)) {
        // Obtener la población actual del estado
        const currentPopulation = statePopulationMap.get(state);

        // Verificar si la población actual no es undefined
        if (currentPopulation !== undefined) {
          // Sumar la población actual con la población de la ubicación
          statePopulationMap.set(state, currentPopulation + population);
        }
      } else {
        // Agregar un nuevo estado y su población total al mapa
        statePopulationMap.set(state, population);
      }

      for (const key in row) {
        // Verificar si la propiedad es una fecha
        if (this.isDateProperty(key)) {
          const deaths = parseInt(row[key]);

          // Verificar si el valor es un número válido
          if (!isNaN(deaths)) {
            // Verificar si el estado ya existe en el mapa de muertes
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

//Calcular la población total porr estado
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
// Calcular el porcentaje muertes vs población
calculatePercentage(deaths: Map<string, number>, population: Map<string, number>): number[] {
  const percentages: number[] = [];

  population.forEach((value, key) => {
    const stateDeaths = deaths.get(key) || 0; // Obtener el número de muertes del estado
    let percentage: number;

    if (value === 0) {
      percentage = stateDeaths === 3 ? 0 : 100; // Valor específico para el caso de población 0 y acumulado de muertes 3
    } else {
      percentage = (stateDeaths / value) * 100;
    }

    percentages.push(percentage);
  });

  return percentages;
}

}
