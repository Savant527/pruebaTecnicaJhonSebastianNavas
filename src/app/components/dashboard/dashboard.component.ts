import { Component, OnInit } from '@angular/core';
import * as Papa from 'papaparse';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  highestState: string = '';
  lowestState: string = '';
  mostAffectedState: string = '';
  totalDeaths: number = 0;
  totalPopulation: Map<string, number> = new Map<string, number>();
  totalPercentage: number[] = [];
  dataLoaded: boolean = false;

  ngOnInit() {
    this.loadLocalStorageData();
    this.drawChart();
  }

  uploadCSV(event: any) {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      complete: (result) => {
        // Procesar los datos del CSV y calcular las respuestas a las preguntas
        const data = result.data;

        // Lógica para calcular las respuestas a las preguntas
        this.highestState = this.calculateHighestState(data);
        this.lowestState = this.calculateLowestState(data);
        this.mostAffectedState = this.calculateMostAffectedState(data);
        this.totalDeaths = this.calculateTotalDeaths(data);
        this.totalPopulation = this.calculateTotalPopulation(data);
        this.totalPercentage = this.calculatePercentage(this.totalDeaths, this.totalPopulation);

        // Guardar los resultados en el LocalStorage
        localStorage.setItem('dashboardData', JSON.stringify({
          highestState: this.highestState,
          lowestState: this.lowestState,
          mostAffectedState: this.mostAffectedState
        }));

        this.dataLoaded = true;
      },
      error: (error) => {
        console.error('Error al procesar el archivo CSV:', error);
      }
    });
  }

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
  calculateTotalDeaths(data: any[]): number {
    let totalDeaths = 0;

    for (const row of data) {
      for (const key in row) {
        // Verificar si la propiedad es una fecha
        if (this.isDateProperty(key)) {
          const deaths = parseInt(row[key]);

          // Verificar si el valor es un número válido
          if (!isNaN(deaths)) {
            totalDeaths += deaths;
          }
        }
      }
    }

    return totalDeaths;
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
  calculatePercentage(deaths: number, population: Map<string, number>): number[] {
    const percentages: number[] = [];
    population.forEach((value) => {
      const percentage = (deaths / value) * 100;
      percentages.push(percentage);
    });
    return percentages;
  }
  loadLocalStorageData() {
    const savedData = localStorage.getItem('dashboardData');

    if (savedData) {
      const data = JSON.parse(savedData);
      this.highestState = data.highestState;
      this.lowestState = data.lowestState;
      this.mostAffectedState = data.mostAffectedState;
      this.dataLoaded = true;
    }
  }
  drawChart() {
    // Calcular el total de muertes y la población total por estado
    const totalDeaths = this.totalDeaths;
    const totalPopulationByState = this.totalPopulation;

    // Calcular los porcentajes de muertes respecto a la población
    const percentages = this.calculatePercentage(totalDeaths, totalPopulationByState);

    // Configurar los datos y opciones de la gráfica
    const data = {
      labels: percentages.map((_, index) => 'Estado ' + (index + 1)),
      datasets: [
        {
          data: percentages,
          backgroundColor: ['red', 'blue', 'green', 'yellow', 'orange']
        }
      ]
    };

    // Obtener el elemento del DOM donde se dibujará la gráfica
    const container = document.getElementById('chart');

    if (container instanceof HTMLCanvasElement) { // Verificar que container no sea nulo
      // Crear el lienzo del gráfico
      const chart = new Chart(container, {
        type: 'pie',
        data: data
      });
    }
  }
}
