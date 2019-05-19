import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AppSettingsServiceProducts {

    constructor(private http: HttpClient) {
        this.getJSON().subscribe(data => {
        });
    }

    public getJSON(): Observable<any> {
        return this.http.get('./assets/products.json');
    }

}
