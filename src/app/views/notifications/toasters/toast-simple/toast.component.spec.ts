import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule, ProgressModule, ToastModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from '../../../../icons/icon-subset';
import { ToastSampleIconComponent } from './toast-sample-icon.component';

describe('ToastComponent', () => {
  let component: ToastSampleIconComponent;
  let fixture: ComponentFixture<ToastSampleIconComponent>;
  let iconSetService: IconSetService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ToastSampleIconComponent],
      imports: [
        NoopAnimationsModule,
        ToastModule,
        ProgressModule,
        ButtonModule,
      ],
      providers: [IconSetService],
    }).compileComponents();
  }));

  beforeEach(() => {
    iconSetService = TestBed.inject(IconSetService);
    iconSetService.icons = { ...iconSubset };

    fixture = TestBed.createComponent(ToastSampleIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
