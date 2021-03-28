import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TelefonesDetailComponent } from './telefones-detail.component';

describe('Component Tests', () => {
  describe('Telefones Management Detail Component', () => {
    let comp: TelefonesDetailComponent;
    let fixture: ComponentFixture<TelefonesDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TelefonesDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ telefones: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TelefonesDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TelefonesDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load telefones on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.telefones).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
