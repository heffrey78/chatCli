import { decorate, injectable } from 'inversify';
import 'reflect-metadata';

export const functionDetailsKey = Symbol('functionDetails');

export function functionDetails(value: any) {
  return function (target: any) {
    decorate(injectable(), target);
    Reflect.defineMetadata(functionDetailsKey, value, target);
  }
}