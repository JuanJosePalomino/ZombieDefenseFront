import { Routes } from '@angular/router';
import { StrategyComponent } from './components/strategy/strategy.component';
import { HistoryComponent } from './components/history/history.component';

export const routes: Routes = [
    {path: '', component: StrategyComponent},
    {path: 'historial', component: HistoryComponent},
];
