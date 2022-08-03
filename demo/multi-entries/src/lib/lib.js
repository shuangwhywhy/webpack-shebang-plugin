import { parse } from '@babel/parser';

parse('var a = {a: 1};', (e, result) => {
	if (!e) log(result);
});

export function log(...args) {
	return console.log(...args);
}
