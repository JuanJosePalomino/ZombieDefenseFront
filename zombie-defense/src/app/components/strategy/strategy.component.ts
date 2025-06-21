import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { StrategyService, ZombieSeleccionado, Zombie} from '../../services/strategy.service';

@Component({
  selector: 'app-strategy',
  imports: [CommonModule, FormsModule],
  templateUrl: './strategy.component.html',
  styleUrl: './strategy.component.scss'
})
export class StrategyComponent implements OnInit {
  bullets: number = 0;
  seconds: number = 0;
  strategy: ZombieSeleccionado[] = [];
  message: string = '';
  error: string = '';
  availableZombies: Zombie[] = [];

  constructor(private service: StrategyService){}
  
  ngOnInit(): void {
    this.service.getAvailableZombies().subscribe({
      next: data => this.availableZombies = data,
      error: () => this.error = 'No se pudo obtener el listado de zombies.'
    });
  }

  getStrategy(){
    this.service.getStrategy(this.bullets, this.seconds).subscribe({
      next: data => {
        this.strategy = data;
        this.error = '';
      },
      error: err => this.error = 'Error al obtener estrategia'
    })
  }

  registrySimulacion(){
    const payload = {
      bullets: this.bullets,
      secondsAvailable: this.seconds,
      zombiesEliminados: this.strategy.map(z => ({
        zombieId: z.zombieId,
        puntajeObtenido: z.puntajeObtenido
      }))
    }

    this.service.registrySimulacion(payload).subscribe({
      next: res => {
        this.message = `Simulación registrada (ID: ${res.simulacionId})`
        this.service.saveLocalHistory(payload);
        this.error = '';
      },
      error: err => {
        this.error = 'Error al registrar la simulación';
        this.service.saveLocalHistory(payload);
      }
    })

  }

}
