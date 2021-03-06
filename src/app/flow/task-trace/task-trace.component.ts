import {Component, OnInit, ViewChild } from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {FlowService} from '../flow.service';
import {LoginService} from '../../login/login.service';
import {
  NavigationExtras,
  Route,
  Router,
  ParamMap,
  ActivatedRoute,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  CanLoad
} from '@angular/router';

import {NzTreeNode} from 'ng-zorro-antd';
import {EssenceNg2PrintComponent} from 'essence-ng2-print';
import {ComponentPortal, Portal, TemplatePortal} from '@angular/cdk/portal';
// import {ExpenseApplyComponent} from '../../expense/expense-apply/expense-apply.component';


@Component({
  selector: 'app-task-trace',
  templateUrl: './task-trace.component.html',
  styleUrls: ['./task-trace.component.css']
})
export class TaskTraceComponent implements OnInit {
  @ViewChild('print', { static: false }) printComponent: EssenceNg2PrintComponent;
  printCSS: string[];
  printStyle: string;
  printBtnBoolean = true;
  currentfiid: any = 0;
  currenttiid: any = 0;
  currentflowtemplateid = '';
  taskheader: any[] = [];
  donetasklist: any[] = [];
  todotasklist: any[] = [];
  portal: Portal<any>;
  pc: any[] = [
    // {path: '/expense-apply', component: ExpenseApplyComponent}
  ];
  url = '';

  constructor(private ls: LoginService, private fs: FlowService, private message: NzMessageService, private router: ActivatedRoute, private router2: Router) {
    this.printCSS = ['/assets/ng-zorro-antd.min.css'];
    this.printStyle =
      `
      th, td {
        color: black !important;
     }
     `;
  }

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      console.log(params);
      if (params.Flowinstid != null && params.Flowinstid != '' && params.Flowinstid != 'undefined') {
        this.currentfiid = parseInt(params.Flowinstid);
        this.currenttiid = parseInt(params.Tiid);
        this.currentflowtemplateid = params.Flowtemplateid;
        this.url = params.Url;
        this.fs.getdonetasklist({'Fiid': this.currentfiid, 'Tiid': this.currenttiid}).subscribe(data => {

          this.donetasklist = data;
          let donetasklist2: any[] = [];
          donetasklist2 = data.slice(0);
          donetasklist2.sort(
            (value1, value2) => {
              if (parseInt(value1.Tiid) > parseInt(value2.Tiid)) {
                return -1;
              }
              if (parseInt(value1.Tiid) < parseInt(value2.Tiid)) {
                return 1;
              }
              return 0;

            }
          );
          this.fs.getflowstatusbyfiid(this.currentfiid).subscribe(data => {
            this.taskheader = [
              {
                'Flowinstid': this.currentfiid, 'Flowstatus': data.Flowstatusname, 'Task': donetasklist2
              }
            ];

          });
        });
        this.fs.gettodotasklist({'Fiid': this.currentfiid, 'Tiid': this.currenttiid}).subscribe(data => {
          this.todotasklist = data;
        });
        // let navigationExtras: NavigationExtras = {
        //   queryParamsHandling: 'preserve',
        //   preserveFragment: true
        // };
        // navigationExtras = {queryParams: {'Mode': 'a', 'Flowinstid': this.currentfiid, 'Tiid': this.currenttiid}};
        // this.router2.navigate(['/expense-apply2'], navigationExtras);
        // this.router2.navigate([{'outlets': {'donetasktrace': ['expense-apply2']}}], navigationExtras);

        this.portal = new ComponentPortal(this.getcomponentbypath(this.url));
      }// if
    });
  }// ngOnInit

  printComplete() {
    this.printBtnBoolean = true;
  }
  beforePrint() {
    this.printBtnBoolean = false;
  }
  getcomponentbypath(path): any {
    for (let cdr of this.pc) {
      if ( cdr.path === path) {
        return cdr.component;
        break;
      }
    }
  }

}
