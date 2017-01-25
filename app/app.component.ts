import { Component } from '@angular/core';
import { LoadingIndicator } from "nativescript-loading-indicator";
import { TNSPDF } from 'nativescript-pdf';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  private loader: LoadingIndicator;  
  public created: boolean;

  constructor() {
    this.loader = new LoadingIndicator();
  }  

  public createPDF() {
    this.loader.show({ message: 'Creating pdf...' });
    let tnsPdf = new TNSPDF();
    tnsPdf.createPDF(
      'Seattle loves NativeScript for Angular', [
      'http://galvanize-wp.s3.amazonaws.com/wp-content/uploads/2015/03/30170453/Galvanize-Galvanize-logomark-text-only-2-2.png',
      'https://docs.nativescript.org/img/cli-getting-started/angular/chapter0/NativeScript_Angular_logo.png'
    ]).then(() => {
      this.loader.hide();
      this.created = true;
    });
  }
}