import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

export type ErrorInput = any;

@Component({
    selector: 'error',
    templateUrl: 'error.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Error {
    private readonly CLASS_NAME = 'Error';

    @Input() error: ErrorInput;

    constructor(
    ) {
        console.log(`%s:constructor`, this.CLASS_NAME);
    }
}
