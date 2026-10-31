import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

fetch('/assets/env.json')
  .then(response => response.json())
  .then(env => {
    // Assign env variables to global window object
    (window as { [key: string]: any })['env'] = env;

    bootstrapApplication(AppComponent, appConfig)
      .catch((err) => console.error(err));
  });
