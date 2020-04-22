import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromApp from '../store/app.reducer'
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  private closeSubscription: Subscription;
  private storeSubscription: Subscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.storeSubscription = this.store.select('auth').subscribe(authState => {
      this.error = authState.authError
      this.isLoading = authState.loading

      if (this.error) {
        this.showErrorAlert(this.error);
      }

      // This is a hack to let the navigation happen before the spinner disappears
      // setTimeout(() => this.isLoading = authState.loading, 1000);
    });
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError(): void {
    this.store.dispatch(new AuthActions.ClearError());
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({email, password}));
    } else {
      this.store.dispatch(new AuthActions.SignUpStart({email, password}));

    }

    // We let this here so we don't see the form reset when authenticating,
    // even though we shouldn't because we are changing the state directly in the component
    // instead of using Redux
    // this.isLoading = true;
    form.reset();
  }

  ngOnDestroy(): void {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
    this.storeSubscription.unsubscribe();
  }

  private showErrorAlert(message: string): void {
    const alertComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const alertComponentRef = hostViewContainerRef.createComponent(alertComponentFactory);
    alertComponentRef.instance.message = message;
    this.closeSubscription = alertComponentRef.instance.closeAlert.subscribe(() => {
      hostViewContainerRef.clear();
      this.onHandleError();
      this.closeSubscription.unsubscribe();
    });
  }
}
