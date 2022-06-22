import { HttpClient, HttpInterceptor } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DefaultUrlSerializer } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'NodeDiskClient';

  dirs : BehaviorSubject <any> = new BehaviorSubject<any>(undefined);
  dirs$ : Observable<any> = this.dirs.asObservable();

  basedir : BehaviorSubject<any> = new BehaviorSubject<any>("C:\\");
  basedir$ : Observable<any> = this.basedir.asObservable();

  dirPath : string[] = ['c:\\'];

  constructor(private http: HttpClient, public sanitizer:DomSanitizer) { 

  }

   
  // getData() : Observable<any> {

  //   console.log("call getData");

  //   //let ret2 = this.http.get<any>("http://localhost:3000/?dir=C:\\Windows\\System32\\drivers\\etc");

  //   //let ret : Observable<any> = this.http.get<any>("http://localhost:3000/?dir=C:\\Windows\\System32\\drivers\\etc").pipe(  tap(item => console.log(item) ) );

  //   //let ret : Observable<any> = this.http.get<any>("http://localhost:3000/?dir=C:\\").pipe( tap(item => console.log(item)) );

  //   return ret;

  // }

  pathClick(event : any)
  {
    //console.log(  this.dirPath.indexOf(event.target.innerText) );

    this.dirPath = this.dirPath.slice(0, this.dirPath.indexOf(event.target.innerText)+1);

    this.basedir.next(this.dirPath.join('\\') );
  }

  ngOnInit() {
    
    //this.dirs$ = this.getData();

    let sum = new DefaultUrlSerializer().parse(window.location.origin);

    this.basedir$.subscribe(item => this.http.get<any>("http://"+window.location.hostname+":3000/?dir=" + item).pipe( tap(item => { console.log(item);  } ) ).subscribe(data => this.dirs.next(data) )  );

    //let sub = combineLatest([ this.dirs$, this.baseDirs$ ]).subscribe(item => console.log(item));

  }

  openFile(base : string, item : string) {

    //window.open("http://"+window.location.hostname+":3000/?file=" + base + "\\" + item, "_blank");

    this.openFilePath = base + "\\" + item;
    this.iframeurl = "http://"+window.location.hostname+":3000/?file=" + base + "\\" + item;  

  }

  getFileInfo(base : string, item : string, arrItem : any) {

    this.http.get<any>("http://"+window.location.hostname+":3000/?fileInfo=" + base+"\\"+item).pipe( tap(item => { 
      console.log(item); } 
      ) ).subscribe(item =>  {
        arrItem.stat = item;
        
        this.dirs.next( this.dirs.value );
      } );

  }

  openFilePath : string = '';
  iframeurl : string = '';

}
