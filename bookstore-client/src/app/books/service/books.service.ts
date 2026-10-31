import {inject, Injectable} from '@angular/core';
import {Author, AuthorDetails, Book} from '../model/book';
import { HttpClient, HttpParams } from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private Url = ((window as { [key: string]: any })['env']).apiUrl;
  private http: HttpClient = inject(HttpClient);

  public getBook(id: string): Observable<Book> {
    return this.http.get<Book>(this.Url + 'books/' + id);
  }

  public getAuthor(id: string): Observable<AuthorDetails> {
    return this.http.get<AuthorDetails>(this.Url + 'authors/' + id);
  }

  public addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.Url + 'books', book);
  }

  public addBookAuthor(id: number, author: Author): Observable<Author> {
    return this.http.post<Author>(this.Url + 'books/' + id + '/authors', author);
  }

  public getAuthorsNamed(firstName: string, lastName: string): Observable<any> {
    const options = {params: new HttpParams().set('firstName', firstName).set('lastName', lastName)};
    return this.http.get<any>(this.Url + 'authors', options).pipe(
      map(response => response._embedded ? response._embedded.authors : undefined )
    );
  }

  public updateBookAuthors(bookId: number, authorId: number): Observable<any> {
    return this.http.patch(this.Url + 'books/' + bookId + '/authors/' + authorId, {});
  }
}
