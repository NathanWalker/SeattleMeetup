export declare class TNSPDF {
    constructor();
    createPDF(text: string, imageUrls: Array<string>): Promise<any>;
    private writePDF(pdf);
}
