import { Component, Input, HostListener, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['default-header.component.scss'],
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {
  @Input() sidebarId: string = 'sidebar';
  pageTitle: string = '';

  public newMessages = new Array(4);
  public newTasks = new Array(5);
  public newNotifications = new Array(5);

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.updatePageTitle();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Prevent the default behavior of the back button
    history.pushState(null, document.title, window.location.href);
  }

  updatePageTitle() {
    this.activatedRoute.url.subscribe(() => {
      this.pageTitle =
        this.activatedRoute.snapshot.firstChild?.data['title'] || '';
    });
  }

  logout() {
    // Clear local storage
    localStorage.clear();

    // Communicate with the server to invalidate the session or token
    // You may need to send a request to the server to log the user out

    // Navigate to the login page
    this.router.navigate(['/login']);
    window.location.href = window.location.origin;
  }
}
