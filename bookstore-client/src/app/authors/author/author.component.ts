import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {NgFor, NgIf} from '@angular/common';
import {AuthorDetails} from '../../books/model/book';
import {BooksService} from '../../books/service/books.service';

@Component({
    selector: 'app-author',
    templateUrl: './author.component.html',
    styleUrls: ['./author.component.css'],
    standalone: true,
    imports: [NgIf, NgFor]
})
export class AuthorComponent implements OnInit, OnDestroy {
  selectedAuthor: AuthorDetails | null = null;
  requestedId = '';
  loading = true;
  private paramSub?: Subscription;
  private subscription?: Subscription;
  private route: ActivatedRoute = inject(ActivatedRoute);
  private booksService: BooksService = inject(BooksService);

  ngOnInit(): void {
    this.paramSub = this.route.params.subscribe(params => {
      this.requestedId = params['id'];
      this.loading = true;
      this.subscription?.unsubscribe();
      this.subscription = this.booksService.getAuthor(this.requestedId).subscribe({
        next: (data: AuthorDetails) => { this.selectedAuthor = data; this.loading = false; },
        error: (_: any) => { this.selectedAuthor = null; this.loading = false; }
      });
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    this.subscription?.unsubscribe();
  }
}
