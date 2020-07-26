import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { PerfComponent } from './calendar/perf/perf.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'calendar/perf', component:PerfComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PagenotfoundComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
