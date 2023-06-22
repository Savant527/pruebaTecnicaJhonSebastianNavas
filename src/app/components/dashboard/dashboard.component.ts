import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  {
  highestState: string = '';
  lowestState: string = '';
  mostAffectedState: string = '';
  dataLoaded: boolean = false;

 

}
