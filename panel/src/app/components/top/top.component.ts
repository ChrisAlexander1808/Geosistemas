import { Component, OnInit } from '@angular/core';
import { TestService } from 'src/app/services/test.service';
declare var KTLayoutAside : any;

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit{
    
    public user:any={};
    public background = '';
    public token = localStorage.getItem('token');
    
    constructor(
      private _testService:TestService,
    ){
      let str_usr : any = localStorage.getItem('user');
      this.user = JSON.parse(str_usr);
    }

    ngOnInit(): void {
      setTimeout(() => {
        KTLayoutAside.init('kt_aside');
      }, 50);
    }

    logout(){
         localStorage.clear();
         window.location.reload();
    }

    
}
