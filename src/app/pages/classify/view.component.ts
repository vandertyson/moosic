import { Component, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { APIService } from '../../auth/APIService';
import { environment } from '../../environment';
import { MusicPlayer } from '../../directives/music-player/player.component'
import { AppStateService } from '../../services/app-state.service'
import { Router } from '@angular/router';
// import 'vendor/pdfjs-dist/build/pdf.js'
// import 'vendor/pdfjs-dist/build/pdf.worker.js'

declare var jQuery: any;
declare var System: any;
declare var PDFJS: any;

@Component({
    selector: 'view',
    templateUrl: 'app/pages/classify/view.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [],
    styleUrls: ['app/pages/classify/view.component.css',
        'assets/css/style.css'],
    directives: []
})

export class ClassifyComponent {
    @ViewChild("myView") myView: ElementRef;
    @ViewChild("input") input: ElementRef;
    private fileName = "Upload a pdf file"
    private abstractText = "";
    private result = []
    private result2 = {}
    private lookup_labels = [
        {
            name: "aimx",
            desc: "The specific research goal of the paper"
        },
        {
            name: "base",
            desc: "Past work that provides the basis for the work in the article"
        },
        {
            name: "ownx",
            desc: "The author’s own work (e.g. methods, results, conclusions)"
        },
        {
            name: "cont",
            desc: "Contrast, comparison or critique of past work"
        },
        {
            name: "misc",
            desc: "Miscellaneous"
        },]
    constructor(private api: APIService) {
        this.initResult()
        // window['PDFJS'].workerSrc = 'vendor/pdfjs-dist/build/pdf.worker.js';
    }

    initResult() {
        this.lookup_labels.forEach(e => {
            this.result2[e.name] = []
        })
    }
    ngAfterViewInit() {
        jQuery(this.myView.nativeElement).addClass("full-screen")
    }

    // onInputChange(e) {
    //     try {
    //         let controller = this;
    //         e.preventDefault();
    //         var file = event.target['files'][0];
    //         var reader = new FileReader();
    //         controller.fileName = file.name;
    //         reader.onload = function (e) {
    //             var data = e.target['result'];
    //             var typedarray = new Uint8Array(data);
    //             PDFJS.getDocument(typedarray).then(function (PDFDocumentInstance) {

    //                 // Use the PDFDocumentInstance To extract the text later
    //                 var totalPages = PDFDocumentInstance.pdfInfo.numPages;
    //                 var pageNumber = 1;
    //                 console.log("loading")
    //                 // Extract the text
    //                 controller.getPageText(pageNumber, PDFDocumentInstance).then(function (textPage) {
    //                     // Show the text of the page in the console
    //                     console.log("load xong")
    //                     // console.log(textPage);
    //                     controller.abstractText = controller.getAbstractfromText(textPage)
    //                 });

    //             }, function (reason) {
    //                 // PDF loading error
    //                 console.error(reason);
    //             });

    //         };
    //         reader.readAsArrayBuffer(file);
    //     }
    //     catch (ex) {
    //         console.log(ex);
    //     }
    // }

    // getPageText(pageNum, PDFDocumentInstance) {
    //     // Return a Promise that is solved once the text of the page is retrieven
    //     return new Promise(function (resolve, reject) {
    //         PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
    //             // The main trick to obtain the text of the PDF page, use the getTextContent method
    //             pdfPage.getTextContent().then(function (textContent) {
    //                 var textItems = textContent.items;
    //                 var finalString = "";

    //                 // Concatenate the string of the item to the final string
    //                 for (var i = 0; i < textItems.length; i++) {
    //                     var item = textItems[i];
    //                     console.log(item)
    //                     finalString += item.str + " ";
    //                 }

    //                 // Solve promise with the text retrieven from the page
    //                 resolve(finalString);
    //             });
    //         });
    //     });
    // }

    // getAbstractfromText(original) {
    //     var clone = original + '';
    //     clone = clone.trim().toLocaleLowerCase();
    //     var start = clone.indexOf('abstract')
    //     var end = clone.indexOf('introduction')
    //     return original.substring(start, end)
    // }

    onSubmit(event) {
        this.result = []
        this.initResult()
        var text = jQuery(this.input.nativeElement).val()
        var param = {
            sentences: this.cleanData(text)
        }
        jQuery(this.myView.nativeElement).find('.submit').toggle()
        this.api.post("http://localhost:8000/recommended_system/test", JSON.stringify(param))
            .map(res => res)
            .subscribe(
            r => {
                var result = r.json()
                for (var index = 0; index < result.sentences.length; index++) {
                    var element = {
                        sentence: result.sentences[index],
                        class: result.class[index]
                    }
                    this.result.push(element)
                }

                for (var index = 0; index < result.sentences.length; index++) {
                    this.result2[result.class[index]].push(result.sentences[index])
                }
                jQuery(this.myView.nativeElement).find('.submit').toggle()
            },
            e => {
                jQuery(this.myView.nativeElement).find('.submit').toggle()
            },
            () => {

            })
    }

    cleanData(text) {
        var result = []
        var s = text
            .trim()
            .replace(/(\r\n|\n|\r)/gm, " ")
            .replace(/et al./g, "and others ")
            .replace(/e.g./g, "for examples ")
            .replace(/i.e./g, "in other words ")
            .replace(/viz./g, "namely ")
            .replace(/vs./g, "against ")
            .replace(/etc./g, "and so forth ")
            .replace(/N.B./g, "note well")
            .replace(/cf./g, "compare with ")
            .replace(/q.v./g, "which see ")
            .trim()
            .split(".")

        s.forEach(element => {
            if (element && element != '')
                result.push(element)
        });
        return result
    }
}

