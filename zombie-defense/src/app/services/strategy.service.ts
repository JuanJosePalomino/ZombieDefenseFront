import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TipoZombie{
  nombre: string;
  balasRequeridas: number;
  tiempoDisparoSegundos: number;
  puntajeOtorgado: number;
  nivelAmenaza: number;
}

export interface ZombieSeleccionado {
  zombieId: number;
  tipoZombie: TipoZombie;
  puntajeObtenido: number;
}

export interface Zombie {
  zombieId: number;
  tipoZombie: TipoZombie;
}

@Injectable({
  providedIn: 'root'
})
export class StrategyService {
  private apiUrl = 'http://localhost:5275/api/Defense';
  private apiKey = 'superclavesecreta-123';

  constructor(private http:HttpClient) { }

  getStrategy(bullets: number, seconds: number) : Observable<ZombieSeleccionado[]>{
    const headers = new HttpHeaders({'X-API-KEY' : this.apiKey});
    const params = new HttpParams().set('bullets', bullets.toString()).set('secondsAvailable', seconds.toString());

    return this.http.get<ZombieSeleccionado[]>(`${this.apiUrl}/optimal-strategy`, { headers, params});
  }

  registrySimulacion(request: {
    bullets: number;
    secondsAvailable: number;
    zombiesEliminados: {zombieId: number; puntajeObtenido: number}[];
  }): Observable<{ simulacionId: number}>{
    const headers = new HttpHeaders({'X-API-KEY' : this.apiKey});
    return this.http.post<{ simulacionId: number}>(`${this.apiUrl}/register-simulation`, request, {headers});
  }

  private HISTORY_KEY = 'zombieDefenseHistory';

  saveLocalHistory(simulacion: {
    bullets: number;
    secondsAvailable: number;
    zombiesEliminados: {zombieId: number; puntajeObtenido: number}[];
    fecha?: string;
  }){
    const saved = this.getLocalHistory();
    simulacion.fecha = new Date().toISOString();
    saved.push(simulacion);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(saved));
  }

  getLocalHistory(): Array<{
    bullets: number;
    secondsAvailable: number;
    zombiesEliminados: {zombieId: number; puntajeObtenido: number}[];
    fecha?: string;
  }>{
    const raw = localStorage.getItem(this.HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  cleanHistory(){
    localStorage.removeItem(this.HISTORY_KEY);
  }

  getAvailableZombies(): Observable<Zombie[]> {
    const headers = new HttpHeaders({ 'X-API-KEY': this.apiKey });
    return this.http.get<Zombie[]>(`${this.apiUrl}/zombies`, { headers });
  }

}
