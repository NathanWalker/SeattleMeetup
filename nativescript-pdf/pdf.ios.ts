import { topmost } from 'ui/frame';
import * as fs from 'file-system';
import * as ai from 'ui/activity-indicator';
import { Cache } from 'ui/image-cache';

declare var SimplePDF: any, CGSize, UIFont;

export class TNSPDF {

  public createPDF(text: string, imageUrls: Array<string>): Promise<any> {
    let A4paperSize = new CGSize({ width: 595, height: 842 });
    console.log('A4paperSize:', A4paperSize);
    console.log('SimplePDF:', SimplePDF);
    let pdf = new SimplePDF({ pageSize: A4paperSize, pageMargin: 20 });
    // console.log('pdf:', pdf);
    // for (let key in pdf) {
    //   console.log(key, pdf[key]);
    // }

    pdf.addText(text);

    if (imageUrls) {
      let cache = new Cache();
      let imagesCached = [];
      for (let url of imageUrls) {
        let image = cache.get(url);
        if (image) {
          imagesCached.push(image);
        }
      }
      if (imagesCached.length === imageUrls.length) {
        for (let image of imagesCached) {
          pdf.addImage(image);
          console.log('added image:', image);
        }
        return this.writePDF(pdf);
        // pdf.addImage(image)
      } else {
        return new Promise((resolve) => {
          let cnt = 0;
          let finish = () => {
            this.writePDF(pdf).then(() => {
              resolve();
            });
          };
          for (let url of imageUrls) {
            console.log('caching url:', url);
            cache.push({
              key: url,
              url: url,
              completed: (image) => {
                cnt++;
                console.log('image loaded:', image);
                console.log('image.constructor.name:', image.constructor.name);
                console.log('cnt:', cnt);
                pdf.addImage(image);
                if (cnt === imageUrls.length) {
                  finish();
                }
              }
            });
          }

        });
      }
    } else {
      return this.writePDF(pdf);
    }
      // pdf.addImage( anImage )

      // let dataArray = [["Test1", "Test2"], ["Test3", "Test4"]];
      // pdf.addTable({ rowCount: 2, columnCount: 2, rowHeight: 20.0, columnWidth: 30.0, tableLineWidth: 1.0, font: UIFont.systemFontOfSize(5.0), dataArray: dataArray });
      // pdf.addTable(2, { columnCount: 2, rowHeight: 20.0, columnWidth: 30.0, tableLineWidth: 1.0, font: UIFont.systemFontOfSize(5.0), dataArray: dataArray });
    }

  private writePDF(pdf: any): Promise<any> {
    return new Promise((resolve) => {
      let pdfData = pdf.generatePDFdata();

      var documents = fs.knownFolders.documents();
      let path = fs.path.join(documents.path, "test.pdf");
      let pdfFile = fs.File.fromPath(path);

      // save as a local file
      pdfFile.writeSync(pdfData, (error) => {
        console.log('write error:', error);
      });
      // Write using NSData api directly
      // pdfData.writeToFileAtomically(path, true);

      console.log('wrote pdf to:', path);
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }


}