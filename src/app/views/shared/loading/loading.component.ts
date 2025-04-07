import { Component } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';

@Component({
    selector: 'app-loading',
    imports: [
        MaterialModule
    ],
    templateUrl: './loading.component.html',
    styleUrl: './loading.component.scss'
})
export class LoadingComponent {

}
