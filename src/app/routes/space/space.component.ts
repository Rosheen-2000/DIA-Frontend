import {Component, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnInit {
  spaceId: string;
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
        console.log('space id changed');
        this.spaceId = params.id;
        console.log(this.spaceId);
      }
    );
  }

}
