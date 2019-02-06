import { Observable, BehaviorSubject, NextObserver } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { distinctUntilChanged, map } from 'rxjs/operators';

export abstract class Store<T> {
  protected state$: Observable<T>;
  private _state$: BehaviorSubject<T>;
  private _storeName: string;

  protected constructor(storeName: string, initialState: T) {
    this._storeName = storeName;
    this._state$ = new BehaviorSubject(initialState);
    this.state$ = this._state$.asObservable();
  }

  /**
   * Subscribe to an observable part or slice of the store
   *
   * @param ref The object (typically a component) that must implement OnDestroy
   * @param projection The projection expression that narrows what part of the store to observe
   * @param changeCallback The function to call when the observed part of the state of the store changes
   * @param initializeStoreWith The optional function to load state into the store before the initial change callback is fired - typically this is another method on the store
   */
  safeSubscribeMap<P>(
    ref: OnDestroy,
    projection: (value: T) => P,
    changeCallback: (state: P) => void,
    initializeStoreWith?: () => void
  ): void {
    console.log(this._storeName + ' ' + ref.constructor.name + ' subscribed');
    if (initializeStoreWith != null) {
      console.log(this._storeName + ' initializing... ');
      initializeStoreWith();
    }
    let next: NextObserver<P> = {
      next: next => {
        console.log(
          this._storeName +
            ' change notification / total observer count = ' +
            this._state$.observers.length
        );
        changeCallback(next);
      }
    };
    const subscription = this.state$
      .pipe(
        map(p => {
          return projection(p);
        })
      )
      .subscribe(next);
    const destroy = ref.ngOnDestroy;
    ref.ngOnDestroy = () => {
      subscription.unsubscribe();
      destroy.apply(ref);
      console.log(
        this._storeName +
          ' ' +
          ref.constructor.name +
          ' unsubscribed / total observer count = ' +
          this._state$.observers.length
      );
    };
  }

  /**
   * Subscribe to the root observable of the store
   *
   * @param ref The object (typically a component) that must implement OnDestroy
   * @param changeCallback The function to call when the state of the store changes
   * @param initializeStoreWith The optional function to load state into the store before the initial change callback is fired - typically this is another method on the store
   */
  safeSubscribe(
    ref: OnDestroy,
    changeCallback: (state: T) => void,
    initializeStoreWith?: () => void
  ): void {
    console.log(this._storeName + ' ' + ref.constructor.name + ' subscribed');
    if (initializeStoreWith != null) {
      console.log(this._storeName + ' initializing... ');
      initializeStoreWith();
    }
    let next: NextObserver<T> = {
      next: next => {
        console.log(
          this._storeName +
            ' change notification / total observer count = ' +
            this._state$.observers.length
        );
        changeCallback(next);
      }
    };
    const subscription = this.state$.subscribe(next);
    const destroy = ref.ngOnDestroy;
    ref.ngOnDestroy = () => {
      subscription.unsubscribe();
      destroy.apply(ref);
      console.log(
        this._storeName +
          ' ' +
          ref.constructor.name +
          ' unsubscribed / total observer count = ' +
          this._state$.observers.length
      );
    };
  }

  protected get state(): T {
    return this._state$.getValue();
  }

  protected setState(nextState: T): void {
    this._state$.next(nextState);
  }
}
