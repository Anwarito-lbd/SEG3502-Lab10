import { Component } from '@angular/core';
import { ActivatedRoute, Router, Routes, RouterOutlet } from '@angular/router';
import {BookComponent} from './book/book.component';

export const booksRoutes: Routes = [
  {path: ':id', component: BookComponent}
];

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.css'],
    standalone: true,
    imports: [RouterOutlet]
})
export class BooksComponent {
  constructor(private router: Router, private route: ActivatedRoute) { }

  submit(value: string): void {
    this.router.navigate(['./', value], {relativeTo: this.route}).then(r => {});
  }
}
