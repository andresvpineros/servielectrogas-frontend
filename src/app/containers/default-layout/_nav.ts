import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Inicio',
    url: '/inicio',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    name: 'Órdenes de trabajo',
    url: '/ordenes-trabajo',
    iconComponent: { name: 'cil-list' },
  },
  {
    name: 'Estadísticas',
    url: '/estadisticas',
    iconComponent: { name: 'cil-chart-pie' },
    children: [
      {
        name: 'Estadísticas',
        url: 'estadisticas',
      },
      {
        name: 'Reportes',
        url: '/app-reports',
      },
    ],
  },
  {
    name: 'Agendamiento',
    url: '/base/progress',
    iconComponent: { name: 'cil-briefcase' },
  },
  {
    name: 'Lista de Clientes',
    url: '/base/cards',
    iconComponent: { name: 'cil-address-book' },
  },
  {
    name: 'Gestionar Usuarios ',
    url: '/register',
    iconComponent: { name: 'cil-people' },
  },
];
