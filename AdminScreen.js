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
                function MainAdmin(http) {
                    var _this = this;
                    this.http = http;
                    this.http.request('users.json').subscribe(function (res) { _this.users = res.json().users; });
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
                    }
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
                        template: "\n    <table>\n      <tr *ngFor=\"let user of users\">\n        <template [ngTemplateOutlet]=\"getScreen(user)\" [ngOutletContext] = \"{ user: user}\"></template>\n        </tr>\n      </table>\n      <template #screen id= \"screen\" let-user=\"user\">\n      <td>name: {{user.name}}</td>\n      <td>password: {{user.pw}}</td>\n      <td>email: {{user.email}}</td>\n      <td><button (click) = \"swapScreen(user)\">Edit</button></td>\n      <td><button (click) = \"delete(user)\">Soft Delete</button></td>\n      </template>\n      <template #edit id= \"edit\" let-user=\"user\">\n      <td><input #editname type=\"text\" value = {{user.name}}/></td>\n      <td><input #editpw type=\"text\" value = {{user.pw}} /></td>\n      <td><input #editemail type=\"text\" value = {{user.email}}/></td>\n      <td><button (click) = \"swapScreen(user, editname.value, editpw.value, editemail.value)\">Save</button></td>\n      <td><button (click) = \"reset(user)\">Reset</button></td>\n      <td><button (click) = \"delete(user)\">Soft Delete</button></td>\n      </template>\n  "
                    }), 
                    __metadata('design:paramtypes', [http_1.Http])
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
                        imports: [platform_browser_1.BrowserModule, http_1.HttpModule, forms_1.FormsModule],
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