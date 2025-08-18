import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr'; // ✅ Add this import

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideToastr() // ✅ Add this line to fix the error
  ]
};
