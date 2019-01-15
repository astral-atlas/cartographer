// @flow

export const isUnique = <T>(value: T, index: number, array: Array<T>): boolean => array.indexOf(value) === index;

export const flatten = <T>(arrA: Array<T>, arrB: Array<T>): Array<T> => [...arrA, ...arrB]; 
