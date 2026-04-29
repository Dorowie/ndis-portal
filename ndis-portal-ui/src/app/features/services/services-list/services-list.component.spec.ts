import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ServicesListComponent } from './services-list.component';
import { ServicesService } from '../../../core/services/services';
import { of, delay } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ServicesListComponent', () => {
  let component: ServicesListComponent;
  let fixture: ComponentFixture<ServicesListComponent>;
  let servicesServiceSpy: jasmine.SpyObj<ServicesService>;

  const mockServices = [
    {
      id: 1,
      service_id: 1,
      name: 'Personal Care',
      description: 'Daily personal care and hygiene assistance',
      category_name: 'Daily Personal Activities',
      price: 50
    },
    {
      id: 2,
      service_id: 2,
      name: 'Community Access',
      description: 'Social and community participation support',
      category_name: 'Community Access',
      price: 60
    }
  ];

  beforeEach(async () => {
    servicesServiceSpy = jasmine.createSpyObj('ServicesService', ['getServices']);

    await TestBed.configureTestingModule({
      imports: [ServicesListComponent],
      providers: [
        { provide: ServicesService, useValue: servicesServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    servicesServiceSpy.getServices.and.returnValue(of(mockServices));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Loading Spinner', () => {
    it('should display loading spinner immediately on page refresh (while API loading)', fakeAsync(() => {
      // Simulate slow API response
      servicesServiceSpy.getServices.and.returnValue(
        of(mockServices).pipe(delay(1000))
      );

      // Trigger component initialization
      fixture.detectChanges();

      // Immediately check - spinner should be visible
      const spinner = fixture.debugElement.query(By.css('[data-testid="loading-spinner"]'));
      expect(spinner).toBeTruthy();
      expect(component.isLoading).toBeTrue();

      tick(1000); // Advance time to complete API call
      fixture.detectChanges();

      // After API response, spinner should be gone
      const spinnerAfterLoad = fixture.debugElement.query(By.css('[data-testid="loading-spinner"]'));
      expect(spinnerAfterLoad).toBeFalsy();
      expect(component.isLoading).toBeFalse();
    }));

    it('should have correct data-testid="loading-spinner" on spinner element', () => {
      servicesServiceSpy.getServices.and.returnValue(of(mockServices));
      fixture.detectChanges();

      // Set loading state to true to show spinner
      component.isLoading = true;
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(By.css('[data-testid="loading-spinner"]'));
      expect(spinner).toBeTruthy();
      expect(spinner.attributes['data-testid']).toBe('loading-spinner');
    }));

    it('should hide loading spinner after API response is received', fakeAsync(() => {
      servicesServiceSpy.getServices.and.returnValue(
        of(mockServices).pipe(delay(500))
      );

      fixture.detectChanges();

      // Initially loading
      expect(component.isLoading).toBeTrue();
      let spinner = fixture.debugElement.query(By.css('[data-testid="loading-spinner"]'));
      expect(spinner).toBeTruthy();

      tick(500); // Complete API call
      fixture.detectChanges();

      // After response
      expect(component.isLoading).toBeFalse();
      spinner = fixture.debugElement.query(By.css('[data-testid="loading-spinner"]'));
      expect(spinner).toBeFalsy();
    }));

    it('should hide loading spinner even if API returns empty array', fakeAsync(() => {
      servicesServiceSpy.getServices.and.returnValue(
        of([]).pipe(delay(300))
      );

      fixture.detectChanges();

      expect(component.isLoading).toBeTrue();

      tick(300);
      fixture.detectChanges();

      expect(component.isLoading).toBeFalse();
      expect(component.services.length).toBe(0);
    }));
  });

  describe('Service Cards', () => {
    it('should display service cards with correct data-testid after loading', fakeAsync(() => {
      servicesServiceSpy.getServices.and.returnValue(
        of(mockServices).pipe(delay(100))
      );

      fixture.detectChanges();
      tick(100);
      fixture.detectChanges();

      const cards = fixture.debugElement.queryAll(By.css('[data-testid="service-card"]'));
      expect(cards.length).toBe(2);
      expect(cards[0].attributes['data-testid']).toBe('service-card');
    }));
  });

  describe('Category Filter Buttons', () => {
    it('should display category filter buttons with correct data-testid', () => {
      servicesServiceSpy.getServices.and.returnValue(of(mockServices));
      fixture.detectChanges();

      const filterButtons = fixture.debugElement.queryAll(By.css('[data-testid="category-filter-btn"]'));
      expect(filterButtons.length).toBeGreaterThan(0);

      // Check "All" button exists
      const allButton = filterButtons.find(btn => btn.nativeElement.textContent.trim() === 'All');
      expect(allButton).toBeTruthy();
    }));

    it('should filter services when category button is clicked', () => {
      servicesServiceSpy.getServices.and.returnValue(of(mockServices));
      fixture.detectChanges();

      // Click on "Daily Personal Activities" filter
      component.selectCategory('Daily Personal Activities');
      fixture.detectChanges();

      expect(component.selectedCategory).toBe('Daily Personal Activities');
      expect(component.filteredServices.length).toBe(1);
      expect(component.filteredServices[0].category_name).toBe('Daily Personal Activities');
    }));

    it('should reset filter when "All" button is clicked', () => {
      servicesServiceSpy.getServices.and.returnValue(of(mockServices));
      fixture.detectChanges();

      // First apply a filter
      component.selectCategory('Daily Personal Activities');
      fixture.detectChanges();

      // Then click All
      component.selectCategory('Category');
      fixture.detectChanges();

      expect(component.selectedCategory).toBe('Category');
      expect(component.filteredServices.length).toBe(2);
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no services match filter', () => {
      servicesServiceSpy.getServices.and.returnValue(of(mockServices));
      fixture.detectChanges();

      // Apply filter that matches nothing
      component.selectCategory('Therapy Supports');
      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(By.css('[data-testid="empty-state"]'));
      expect(emptyState).toBeTruthy();
    }));
  });
});
