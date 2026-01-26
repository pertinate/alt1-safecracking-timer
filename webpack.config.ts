import alt1chain from "@alt1/webpack";
import * as path from "path";

var srcdir = path.resolve(__dirname, "./src/");
var outdir = path.resolve(__dirname, "./dist/");

//wrapper around webpack-chain, most stuff you'll need are direct properties,
//more finetuning can be done at config.chain
//the wrapper gives decent webpack defaults for everything alt1/typescript/react related
var config = new alt1chain(srcdir, { ugly: false });

//exposes all root level exports as UMD (as named package "testpackege" or "TEST" in global scope)
config.makeUmd("testpackage", "TEST");

//the name and location of our entry file (the name is used for output and can contain a relative path)
config.entry("index", "./index.ts");

//where to put all the stuff
config.output(outdir);

//ignore optional node dependencies that aren't needed in browser
const webpackConfig = config.toConfig();
webpackConfig.resolve = webpackConfig.resolve || {};
webpackConfig.resolve.fallback = {
	...webpackConfig.resolve.fallback,
	sharp: false,
	canvas: false,
	"electron/common": false
};

export default webpackConfig;