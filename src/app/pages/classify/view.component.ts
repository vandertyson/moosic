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
    private keywords = []
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
        this.keywords = []
        jQuery("#theText").html("")
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
        var cleanText = this.cleanData(text)
        var p1 = []

        cleanText.split(".").forEach(element => {
            if (element && element != '')
                p1.push(element)
        });
        var param1 = {
            sentences: p1,
            full: cleanText
        }
        jQuery(this.myView.nativeElement).find('.submit').toggle()
        this.api.post("http://localhost:8000/recommended_system/test", JSON.stringify(param1))
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
                this.keywords = result.keywords

                var str = cleanText;
                var places = [];
                var showText = str;
                // if (this.keywords) {
                var bolds = this.keywords.map(obj => { return obj[0] })
                // console.log(bolds)
                for (var obj of this.keywords) {
                    var place = {
                        "start": str.indexOf(obj[1].trim()),
                        "end": str.indexOf(obj[1].trim()) + obj[1].trim().length,
                        "bold": obj[0],
                        "rank": this.getRank(obj[0], bolds)
                    }
                    places.push(place);
                }
                // places[0].start += 1
                // places[0].end += 1
                showText = this.highlight(places, str)
                document.getElementById("theText").innerHTML = showText;
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
            .replace(new RegExp("-", 'g'), " ")
            // .replace(/et al./g, "and others ")
            // .replace(/e.g./g, "for examples ")
            // .replace(/i.e./g, "in other words ")
            // .replace(/viz./g, "namely ")
            // .replace(/vs./g, "against ")
            // .replace(/etc./g, "and so forth ")
            // .replace(/N.B./g, "note well")
            // .replace(/cf./g, "compare with ")
            // .replace(/q.v./g, "which see ")
            .trim()
            .toLocaleLowerCase()
        //     .split(".")

        // s.forEach(element => {
        //     if (element && element != '')
        //         result.push(element)
        // });
        return s
    }

    highlight(places, str) {
        var starts = [], ends = [], links = [], ranks = []

        places.forEach(place => {
            starts.push(place.start);
            ends.push(place.end);
            ranks.push(place.rank)
        });
        var max = ranks.sort((a, b) => { return b.rank - a.rank })[0]
        var min = ranks.sort((a, b) => { return b.rank - a.rank })[ranks.length - 1]        
        return str.split('').map((chr, pos) => {
            if (starts.indexOf(pos) != -1) {
                // var num = links.pop()
                // var w = num * 100 + ''
                // var s = Math.min(num / 0.2, 36) + 'px'
                var i = starts.indexOf(pos)
                console.log(i, this.keywords[i], places[i])

                var num = places[i].rank
                var w = 700 * (num - min)
                var s = 36 - num*2;
                if (s < 14) s = 14
                // if (w < 100) w = 100
                chr = '<a><b class="cursor" style="font-weight:' + w + ' ;font-size:' + s + 'px">' + chr;
            }
            if (ends.indexOf(pos) != -1) {
                chr = '</b></a>' + chr;
            }
            return chr;
        }).join('')
    }

    getRank(value, arr) {
        var sorted = arr.sort((a, b) => { return b - a })
        return sorted.indexOf(value) + 1
    }

}

