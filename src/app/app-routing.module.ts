import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { RegisterComponent } from './views/pages/register/register.component';
import { ReportsComponent } from './modules/reports/reports.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio-sesion',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'inicio',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        data: {
          title: 'Inicio',
        },
      },
      {
        path: 'estadisticas',
        loadChildren: () =>
          import('./modules/statistics/statistics.module').then(
            (m) => m.StatisticsModule
          ),
        data: {
          title: 'Estadísticas',
        },
      },
      {
        path: 'app-reports',
        component: ReportsComponent,
        data: {
          title: 'Reportes',
        },
      },
      {
        path: 'ordenes-trabajo',
        loadChildren: () =>
          import('./modules/orders/orders.module').then((m) => m.OrdersModule),
        data: {
          title: 'Órdenes de Trabajo',
        },
      },
      {
        path: 'theme',
        loadChildren: () =>
          import('./views/theme/theme.module').then((m) => m.ThemeModule),
      },
      {
        path: 'base',
        loadChildren: () =>
          import('./views/base/base.module').then((m) => m.BaseModule),
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./views/buttons/buttons.module').then((m) => m.ButtonsModule),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./views/forms/forms.module').then((m) => m.CoreUIFormsModule),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/charts/charts.module').then((m) => m.ChartsModule),
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/icons.module').then((m) => m.IconsModule),
      },
      {
        path: 'Clientes',
        loadChildren: () =>
          import('./views/notifications/notifications.module').then(
            (m) => m.NotificationsModule
          ),
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/widgets.module').then((m) => m.WidgetsModule),
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule),
      },
    ],
  },

  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500',
    },
  },
  {
    path: 'inicio-sesion',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
    data: {
      title: 'Inicio de sesión',
    },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page',
    },
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
      useHash: false,
      // relativeLinkResolution: 'legacy'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
