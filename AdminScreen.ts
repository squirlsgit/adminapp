import {
  NgModule,
  Component,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {Http, Response, HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule, FormBuilder} from '@angular/forms';
@Component({
  selector: 'main-admin',
  template: `
  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label>Search for User: </label>
      <input class="form-control" formControlName="Reg_Search" placeholder="Name, Email">
      <label>Activated: </label>
      <input type="checkbox" class="form-control" formControlName="Status_Active" name ="status_active" checked>
      <label>Deactivated: </label>
      <input type="checkbox" class="form-control" formControlName="Status_Inactive" name ="status_inactive" checked>
    </div>
  </form>
    <table>
      <tr *ngFor="let user of users">
        <template [ngTemplateOutlet]="getScreen(user)" [ngOutletContext] = "{ user: user}"></template>
        </tr>
      </table>
	  <button (click) ="sendChanges()">Confirm</button>
      <template #screen id= "screen" let-user="user">
      <td>name: {{user.name}}</td>
      <td>password: {{user.pw}}</td>
      <td>email: {{user.email}}</td>
      <td>status: {{user.status}}</td>
      <td><button (click) = "swapScreen(user)">Edit</button></td>
      <td><button (click) = "delete(user)">Soft Delete</button></td>
      </template>
      <template #edit id= "edit" let-user="user">
      <td><input #editname type="text" value = {{user.name}}/></td>
      <td><input #editpw type="text" value = {{user.pw}} /></td>
      <td><input #editemail type="text" value = {{user.email}}/></td>
      <td>status: {{user.status}}</td>
      <td><button (click) = "swapScreen(user, editname.value, editpw.value, editemail.value)">Save</button></td>
      <td><button (click) = "reset(user)">Reset</button></td>
      <td><button (click) = "delete(user)">Soft Delete</button></td>
      </template>
  `
})class MainAdmin{
  @ViewChild('screen') displayUser : TemplateRef<any>;
  @ViewChild('edit') editUser : TemplateRef<any>;
  users: Array<any>;
  shadowusers: Array<any>;
  form;
  constructor(private http: Http, private formBuilder: FormBuilder) {
    this.http.request('users.json').subscribe((res: Response) => {this.shadowusers = res.json().users, this.users = res.json().users});
    this.form = formBuilder.group({
      Reg_Search: '',
      Status_Active: true,
      Status_Inactive: true
    });
    this.form.valueChanges.subscribe(data => {
      console.log('Form changes', data);
      if(data.Reg_Search != ''){
        this.users = [];
        let input = data.Reg_Search;
        input = String(input).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
        console.log(input);
        let regex = new RegExp(input);
          this.shadowusers.forEach(user => {
            //console.log(regex.source);
            //console.log(user.status);
            if((user.name.match(regex) || user.email.match(regex)) && ((data.Status_Inactive && user.status == "Deactivated") || (data.Status_Active && user.status == "Activated"))){
              this.users.push(user);
            }
        });

    }else {
      this.users = [];
      this.shadowusers.forEach(user => {
        if((data.Status_Inactive && user.status == "Deactivated") || (data.Status_Active && user.status == "Activated")) this.users.push(user)
      });
    }


    });
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
		let index: number = this.users.indexOf(user);
		this.shadowusers[index].name = name;
		this.shadowusers[index].pw = pw;
		this.shadowusers[index].email = email;
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
	  this.shadowusers.splice(index,1);
    }
  }
  sendChanges(): void{
	console.log("confirmed changes",this.shadowusers);
  }

}
@NgModule({
  declarations: [
    MainAdmin,

  ],
  imports: [ BrowserModule, HttpModule, FormsModule, ReactiveFormsModule  ],
  bootstrap: [ MainAdmin ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);

//to do: users need to request from server, select amount per page. and same for find, shadowusers will now store the pushed user changes in a stacked array of user changes [useroriginal -> userfinal and will display this list upon request]
