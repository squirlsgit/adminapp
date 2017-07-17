System.register(['@angular/core', '@angular/platform-browser', '@angular/platform-browser-dynamic', '@angular/http', '@angular/forms'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, platform_browser_1, platform_browser_dynamic_1, http_1, forms_1;
    var MainAdmin, AppModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            }],
        execute: function() {
            MainAdmin = (function () {
                function MainAdmin(http, formBuilder) {
                    var _this = this;
                    this.http = http;
                    this.formBuilder = formBuilder;
                    this.http.request('users.json').subscribe(function (res) { _this.shadowusers = res.json().users, _this.users = res.json().users; });
                    this.form = formBuilder.group({
                        Reg_Search: '',
                        Status_Active: true,
                        Status_Inactive: true
                    });
                    this.form.valueChanges.subscribe(function (data) {
                        console.log('Form changes', data);
                        if (data.Reg_Search != '') {
                            _this.users = [];
                            var input = data.Reg_Search;
                            input = String(input).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
                            console.log(input);
                            var regex_1 = new RegExp(input);
                            _this.shadowusers.forEach(function (user) {
                                //console.log(regex.source);
                                //console.log(user.status);
                                if ((user.name.match(regex_1) || user.email.match(regex_1)) && ((data.Status_Inactive && user.status == "Deactivated") || (data.Status_Active && user.status == "Activated"))) {
                                    _this.users.push(user);
                                }
                            });
                        }
                        else {
                            _this.users = [];
                            _this.shadowusers.forEach(function (user) {
                                if ((data.Status_Inactive && user.status == "Deactivated") || (data.Status_Active && user.status == "Activated"))
                                    _this.users.push(user);
                            });
                        }
                    });
                }
                MainAdmin.prototype.getScreen = function (user) {
                    if (user.screen === "view") {
                        return this.displayUser;
                    }
                    else if (user.screen === "edit") {
                        return this.editUser;
                    }
                };
                MainAdmin.prototype.swapScreen = function (user, name, pw, email) {
                    if (user.screen === "view") {
                        user.screen = "edit";
                        console.log("swapping screen to " + user.screen + ", name and etc.: " + name + ", " + name + ", " + email + ", " + pw);
                    }
                    else if (user.screen === "edit") {
                        var index = this.users.indexOf(user);
                        this.shadowusers[index].name = name;
                        this.shadowusers[index].pw = pw;
                        this.shadowusers[index].email = email;
                        user.name = name;
                        user.pw = pw;
                        user.email = email;
                        user.screen = "view";
                        console.log("swapping screen to " + user.screen + ", name and etc.: " + name + ", " + name + ", " + email + ", " + pw);
                    }
                };
                MainAdmin.prototype.reset = function (user) {
                    user.screen = "view";
                };
                MainAdmin.prototype.delete = function (user) {
                    var index = this.users.indexOf(user);
                    if (index !== -1) {
                        this.users.splice(index, 1);
                        this.shadowusers.splice(index, 1);
                    }
                };
                MainAdmin.prototype.sendChanges = function () {
                    console.log("confirmed changes", this.shadowusers);
                };
                __decorate([
                    core_1.ViewChild('screen'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], MainAdmin.prototype, "displayUser", void 0);
                __decorate([
                    core_1.ViewChild('edit'), 
                    __metadata('design:type', core_1.TemplateRef)
                ], MainAdmin.prototype, "editUser", void 0);
                MainAdmin = __decorate([
                    core_1.Component({
                        selector: 'main-admin',
                        template: "\n  <form [formGroup]=\"form\" (ngSubmit)=\"onSubmit()\">\n    <div class=\"form-group\">\n      <label>Search for User: </label>\n      <input class=\"form-control\" formControlName=\"Reg_Search\" placeholder=\"Name, Email\">\n      <label>Activated: </label>\n      <input type=\"checkbox\" class=\"form-control\" formControlName=\"Status_Active\" name =\"status_active\" checked>\n      <label>Deactivated: </label>\n      <input type=\"checkbox\" class=\"form-control\" formControlName=\"Status_Inactive\" name =\"status_inactive\" checked>\n    </div>\n  </form>\n    <table>\n      <tr *ngFor=\"let user of users\">\n        <template [ngTemplateOutlet]=\"getScreen(user)\" [ngOutletContext] = \"{ user: user}\"></template>\n        </tr>\n      </table>\n\t  <button (click) =\"sendChanges()\">Confirm</button>\n      <template #screen id= \"screen\" let-user=\"user\">\n      <td>name: {{user.name}}</td>\n      <td>password: {{user.pw}}</td>\n      <td>email: {{user.email}}</td>\n      <td>status: {{user.status}}</td>\n      <td><button (click) = \"swapScreen(user)\">Edit</button></td>\n      <td><button (click) = \"delete(user)\">Soft Delete</button></td>\n      </template>\n      <template #edit id= \"edit\" let-user=\"user\">\n      <td><input #editname type=\"text\" value = {{user.name}}/></td>\n      <td><input #editpw type=\"text\" value = {{user.pw}} /></td>\n      <td><input #editemail type=\"text\" value = {{user.email}}/></td>\n      <td>status: {{user.status}}</td>\n      <td><button (click) = \"swapScreen(user, editname.value, editpw.value, editemail.value)\">Save</button></td>\n      <td><button (click) = \"reset(user)\">Reset</button></td>\n      <td><button (click) = \"delete(user)\">Soft Delete</button></td>\n      </template>\n  "
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, forms_1.FormBuilder])
                ], MainAdmin);
                return MainAdmin;
            }());
            AppModule = (function () {
                function AppModule() {
                }
                AppModule = __decorate([
                    core_1.NgModule({
                        declarations: [
                            MainAdmin,
                        ],
                        imports: [platform_browser_1.BrowserModule, http_1.HttpModule, forms_1.FormsModule, forms_1.ReactiveFormsModule],
                        bootstrap: [MainAdmin]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppModule);
                return AppModule;
            }());
            platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(AppModule);
        }
    }
});
//# sourceMappingURL=AdminScreen.js.map