import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-power-board',
  templateUrl: './power-board.component.html',
  styleUrls: ['./power-board.component.scss']
})
export class PowerBoardComponent implements OnInit {

  public powerBoardVisible = false;

  constructor() { }

  ngOnInit(): void {
  }

  openPowerDrawer(): void {
    this.powerBoardVisible = true;
  }

  closePowerDrawer(): void {
    this.powerBoardVisible = false;
  }
}
