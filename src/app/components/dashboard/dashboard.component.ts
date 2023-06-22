import { Component, OnInit } from '@angular/core';
import * as Papa from 'papaparse';
import { Chart } from 'chart.js';
import { DashboardService } from 'src/app/services/dashboard.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  highestState: string = '';
  lowestState: string = '';
  mostAffectedState: string = '';
  totalDeaths: any = 0;
  totalPopulation: Map<string, number> = new Map<string, number>();
  totalPercentage: number[] = [];
  dataLoaded: boolean = false;

  constructor(private dashboardService: DashboardService) {

  }
  

  ngOnInit() {
    this.loadLocalStorageData();
  }

  uploadCSV(event: any) {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      complete: (result) => {
        // Procesar los datos del CSV y calcular las respuestas a las preguntas
        const data = result.data;

        // Lógica para calcular las respuestas a las preguntas
        this.highestState = this.dashboardService.calculateHighestState(data);
        this.lowestState = this.dashboardService.calculateLowestState(data);
        this.mostAffectedState = this.dashboardService.calculateMostAffectedState(data);
        this.totalDeaths = this.dashboardService.calculateTotalDeaths(data);
        this.totalPopulation = this.dashboardService.calculateTotalPopulation(data);
        this.totalPercentage = this.dashboardService.calculatePercentage(this.totalDeaths, this.totalPopulation);

        // Guardar los resultados en el LocalStorage
        localStorage.setItem('dashboardData', JSON.stringify({
          highestState: this.highestState,
          lowestState: this.lowestState,
          mostAffectedState: this.mostAffectedState,
          totalDeaths: this.totalDeaths,
          totalPopulation: this.totalPopulation,
          totalPercentage: this.totalPercentage

        }));

        this.dataLoaded = true;
        this.drawChart();
      },
      error: (error) => {
        console.error('Error al procesar el archivo CSV:', error);
      }
    });
  }


  loadLocalStorageData() {
    const savedData = localStorage.getItem('dashboardData');

    if (savedData) {
      const data = JSON.parse(savedData);
      this.highestState = data.highestState;
      this.lowestState = data.lowestState;
      this.mostAffectedState = data.mostAffectedState;
      this.totalDeaths= data.totalDeaths,
      this.totalPopulation= data.totalPopulation,
      this.totalPercentage= data.totalPercentage
      this.dataLoaded = true;
    }
  }
  drawChart() {
    // Calcular el total de muertes y la población total por estado
    const totalDeaths = this.totalDeaths;
    const totalPopulationByState = this.totalPopulation;

    // Calcular los porcentajes de muertes respecto a la población
    const percentages = this.dashboardService.calculatePercentage(totalDeaths, totalPopulationByState);

    const stateNames = Array.from(totalPopulationByState.keys());

    // Configurar los datos y opciones de la gráfica
    const data = {
      labels: stateNames,
      datasets: [
        {
          data: percentages,
          backgroundColor: [
            'red',
            'blue',
            'green',
            'yellow',
            'orange',
            'purple',
            'pink',
            'teal',
            'brown',
            'gray',
            'magenta',
            'cyan',
            'lime',
            'indigo',
            'silver',
            'gold',
            'navy',
            'olive',
            'maroon',
            'aqua',
            'coral',
            'violet',
            'salmon',
            'lightblue',
            'darkgreen',
            'lightpink',
            'darkorange',
            'lightgray',
            'darkred',
            'lightgreen',
            'darkyellow',
            'lightorange',
            'darkpurple',
            'lightteal',
            'darkbrown',
            'lightmagenta',
            'darkcyan',
            'lightlime',
            'darkindigo',
            'lightsilver',
            'darkgold',
            'lightnavy',
            'darkolive',
            'lightmaroon',
            'darkaqua',
            'lightcoral',
            'darkviolet',
            'lightsalmon',
            'darklightblue',
            'darkslategray',
            'midnightblue',
            'tomato',
            'orchid',
            'skyblue',
            'limegreen',
            'slategray',
            'crimson',
            'steelblue'
          ]
        }
      ]
    };

    // Obtener el elemento del DOM donde se dibujará la gráfica
    const container = document.getElementById('chart');

    if (container instanceof HTMLCanvasElement) { // Verificar que container no sea nulo
      // Crear el lienzo del gráfico
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const scaleFactor = 3;
      container.width = containerWidth * scaleFactor;
      container.height = containerHeight * scaleFactor;

      const chart = new Chart(container, {
        type: 'pie',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }
}
