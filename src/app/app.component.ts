import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Observable, Subject, takeUntil} from "rxjs";
import {AppPageService} from "./services/app-page.service";
import {Entity} from "./models/entity";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
    private readonly terminate$ = new Subject<void>();
    public readonly entitiesToShow$: Observable<Array<Entity>> = this.pageService.entitiesToShow$;
    public readonly form = new FormGroup({
        timer: new FormControl(300),
        size: new FormControl(1000),
    });
    public readonly additionalIdsControl = new FormControl('15, 35, 63, 32');

    constructor(
        private pageService: AppPageService
    ) {
    }

    public ngOnInit(): void {
        this.form.valueChanges
            .pipe(takeUntil(this.terminate$))
            .subscribe(value => {
                if (value.timer && value.size) {
                    this.pageService.updateSettings(value.timer, value.size,);
                }

            })
        this.additionalIdsControl.valueChanges
            .pipe(takeUntil(this.terminate$))
            .subscribe(value => this.pageService.updateAdditionalIds(value || ''));

        this.pageService.listen();
        this.form.updateValueAndValidity();
        this.additionalIdsControl.updateValueAndValidity();
    }

    ngOnDestroy() {
        this.terminate$.next();
        this.terminate$.complete();
        this.pageService.stopListening();
    }

    trackByFn(index: number, item: any): any {
        return item.id;
    }
}
