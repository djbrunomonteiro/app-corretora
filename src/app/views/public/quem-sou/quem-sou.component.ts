import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { EMeta } from '../../../enums/meta';

@Component({
    selector: 'app-quem-sou',
    imports: [
        CommonModule
    ],
    templateUrl: './quem-sou.component.html',
    styleUrl: './quem-sou.component.scss'
})
export class QuemSouComponent implements OnInit {
  core = inject(CoreService);
  ngOnInit(): void {
    this.core.setTitle('Telma Monteiro - Quem sou eu?');
    this.core.updateMeta('Telma Monteiro - Quem sou eu?', EMeta.KEY_SOU);
  }

}
