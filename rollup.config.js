import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import scss from "rollup-plugin-scss";
import typescript from "@rollup/plugin-typescript";

const production = !process.env.ROLLUP_WATCH;

export default [{
	input: 'src/main.ts',
	output: [{
			file: 'dist/emails-input.js',
			format: 'iife',
			sourcemap: true
		}],
	plugins: [
		typescript(),
		production && terser(),
		!production && serve({
			contentBase: ["public", "dist"]
		}),
		!production && livereload(),
		scss({
			output: "dist/emails-input.css",
			watch: "src"
		})
	]
}];
