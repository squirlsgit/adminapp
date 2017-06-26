import {
  NgModule,
  Component,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {Http, Response, HttpModule} from '@angular/http';
import {Observable} from 'rxjs/Rx'
import {FormsModule} from '@angular/forms'
@Component({
  selector: 'main-admin',
  template: `
    <table>
      <tr *ngFor="let user of users">
        <template [ngTemplateOutlet]="getScreen(user)" [ngOutletContext] = "{ user: user}"></template>
        </tr>
      </table>
      <template #screen id= "screen" let-user="user">
      <td>name: {{user.name}}</td>
      <td>password: {{user.pw}}</td>
      <td>email: {{user.email}}</td>
      <td><button (click) = "swapScreen(user)">Edit</button></td>
      <td><button (click) = "delete(user)">Soft Delete</button></td>
      </template>
      <template #edit id= "edit" let-user="user">
      <td><input #editname type="text" value = {{user.name}}/></td>
      <td><input #editpw type="text" value = {{user.pw}} /></td>
      <td><input #editemail type="text" value = {{user.email}}/></td>
      <td><button (click) = "swapScreen(user, editname.value, editpw.value, editemail.value)">Save</button></td>
      <td><button (click) = "reset(user)">Reset</button></td>
      <td><button (click) = "delete(user)">Soft Delete</button></td>
      </template>
  `
})class MainAdmin{
  @ViewChild('screen') displayUser : TemplateRef<any>;
  @ViewChild('edit') editUser : TemplateRef<any>;
  users: Array<any>;
  constructor(private http: Http) {
    this.http.request('users.json').subscribe((res: Response) => {this.users = res.json().users});
  }
  getScreen(user: any): TemplateRef<any> {
    if (user.screen === "view"){
      return this.displayUser;
    } else if (user.screen === "edit"){ return this.editUser;}
  }
  swapScreen(user: any, name: any, pw: any, email: any): void {
      if (user.screen === "view") {user.screen = "edit";
      console.log("swapping screen to " + user.screen + ", name and etc.: " + name + ", " + name + ", " + email + ", " + pw); }
      else if (user.screen === "edit") {
        user.name = name;
        user.pw = pw;
        user.email = email;
        user.screen = "view";
        console.log("swapping screen to " + user.screen + ", name and etc.: " + name + ", " + name + ", " + email + ", " + pw);
    }
  }
  reset(user: any): void {
    user.screen = "view";
  }
  delete(user: any): void {
    let index: number = this.users.indexOf(user);
    if (index !== -1){
      this.users.splice(index,1);
    }
  }

}
@NgModule({
  declarations: [
    MainAdmin,

  ],
  imports: [ BrowserModule, HttpModule, FormsModule  ],
  bootstrap: [ MainAdmin ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
