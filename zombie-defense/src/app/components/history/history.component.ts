import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component , OnInit } from '@angular/core';
import { StrategyService } from '../../services/strategy.service';

@Component({
  selector: 'app-history',
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  history: Array<{
    bullets: number;
    secondsAvailable: number;
    zombiesEliminados: {zombieId: number; puntajeObtenido: number}[];
    fecha?: string;
  }> = [];

  constructor(private service: StrategyService){}

  ngOnInit(): void {
    this.history = this.service.getLocalHistory().sort((a, b) =>
      this.getTotalPoints(b) - this.getTotalPoints(a)
    );
  }

  getTotalPoints(simulacion: {
    bullets: number;
    secondsAvailable: number;
    zombiesEliminados: {zombieId: number; puntajeObtenido: number}[];
    fecha?: string;
  }) : number{
    return simulacion.zombiesEliminados.map(z => z.puntajeObtenido).reduce((acc, cur) => acc + cur, 0);
  }

  deleteHistory(){
    this.service.cleanHistory();
    this.history = [];
  }
}
