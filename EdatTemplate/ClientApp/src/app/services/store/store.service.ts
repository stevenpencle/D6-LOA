import { Observable, BehaviorSubject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { distinctUntilChanged, map } from 'rxjs/operators';

export class Store<T> {
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
   */

  safeSubscribeMap<P>(
    ref: OnDestroy,
    projection: (value: T) => P,
    changeCallback: (state: P) => void
  ): void {
    console.log(this._storeName + ' ' + ref.constructor.name + ' subscribed');
    const subscription = this.state$
      .pipe(
        distinctUntilChanged(),
        map(p => {
          return projection(p);
        })
      )
      .subscribe((state: P) => {
        console.log(
          this._storeName +
            ' change notification / total observer count = ' +
            this._state$.observers.length
        );
        changeCallback(state);
      });
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
   */
  safeSubscribe(ref: OnDestroy, changeCallback: (state: T) => void): void {
    console.log(this._storeName + ' ' + ref.constructor.name + ' subscribed');
    const subscription = this.state$.subscribe((state: T) => {
      console.log(
        this._storeName +
          ' change notification / total observer count = ' +
          this._state$.observers.length
      );
      changeCallback(state);
    });
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
