import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-authors',
    templateUrl: './authors.component.html',
    styleUrls: ['./authors.component.css'],
    standalone: true,
    imports: [RouterOutlet]
})
export class AuthorsComponent {
  constructor(private router: Router, private route: ActivatedRoute) { }

  submit(value: string): void {
    if (!value || !value.trim()) { return; }
    this.router.navigate(['./', value.trim()], {relativeTo: this.route}).then(_ => {});
  }
}
