import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {


// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 2031:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const spinners = Object.assign({}, __nccwpck_require__(6374)); // eslint-disable-line import/extensions

const spinnersList = Object.keys(spinners);

Object.defineProperty(spinners, 'random', {
	get() {
		const randomIndex = Math.floor(Math.random() * spinnersList.length);
		const spinnerName = spinnersList[randomIndex];
		return spinners[spinnerName];
	}
});

module.exports = spinners;


/***/ }),

/***/ 7881:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const cp = __nccwpck_require__(2081);
const parse = __nccwpck_require__(6855);
const enoent = __nccwpck_require__(4101);

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;

module.exports._parse = parse;
module.exports._enoent = enoent;


/***/ }),

/***/ 4101:
/***/ ((module) => {



const isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed, 'spawn');

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

module.exports = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};


/***/ }),

/***/ 6855:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const path = __nccwpck_require__(1017);
const resolveCommand = __nccwpck_require__(7274);
const escape = __nccwpck_require__(4274);
const readShebang = __nccwpck_require__(1252);

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

function detectShebang(parsed) {
    parsed.file = resolveCommand(parsed);

    const shebang = parsed.file && readShebang(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path.normalize(parsed.command);

        // Escape command & arguments
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parsed : parseNonShell(parsed);
}

module.exports = parse;


/***/ }),

/***/ 4274:
/***/ ((module) => {



// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

module.exports.command = escapeCommand;
module.exports.argument = escapeArgument;


/***/ }),

/***/ 1252:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const fs = __nccwpck_require__(7147);
const shebangCommand = __nccwpck_require__(7032);

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    const buffer = Buffer.alloc(size);

    let fd;

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

module.exports = readShebang;


/***/ }),

/***/ 7274:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const path = __nccwpck_require__(1017);
const which = __nccwpck_require__(4207);
const getPathKey = __nccwpck_require__(539);

function resolveCommandAttempt(parsed, withoutPathExt) {
    const env = parsed.options.env || process.env;
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;
    // Worker threads do not have process.chdir()
    const shouldSwitchCwd = hasCustomCwd && process.chdir !== undefined && !process.chdir.disabled;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (shouldSwitchCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which.sync(parsed.command, {
            path: env[getPathKey({ env })],
            pathExt: withoutPathExt ? path.delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        if (shouldSwitchCwd) {
            process.chdir(cwd);
        }
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

module.exports = resolveCommand;


/***/ }),

/***/ 7126:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs = __nccwpck_require__(7147)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __nccwpck_require__(2001)
} else {
  core = __nccwpck_require__(9728)
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}


/***/ }),

/***/ 9728:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(7147)

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}


/***/ }),

/***/ 2001:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(7147)

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}


/***/ }),

/***/ 7129:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



// A linked list to keep track of recently-used-ness
const Yallist = __nccwpck_require__(665)

const MAX = Symbol('max')
const LENGTH = Symbol('length')
const LENGTH_CALCULATOR = Symbol('lengthCalculator')
const ALLOW_STALE = Symbol('allowStale')
const MAX_AGE = Symbol('maxAge')
const DISPOSE = Symbol('dispose')
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet')
const LRU_LIST = Symbol('lruList')
const CACHE = Symbol('cache')
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet')

const naiveLength = () => 1

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options }

    if (!options)
      options = {}

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    const max = this[MAX] = options.max || Infinity

    const lc = options.length || naiveLength
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc
    this[ALLOW_STALE] = options.stale || false
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0
    this[DISPOSE] = options.dispose
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false
    this.reset()
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity
    trim(this)
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA
    trim(this)
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      })
    }
    trim(this)
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev
      forEachStep(this, fn, walker, thisp)
      walker = prev
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next
      forEachStep(this, fn, walker, thisp)
      walker = next
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value))
    }

    this[CACHE] = new Map() // hash of items by key
    this[LRU_LIST] = new Yallist() // list of items in order of use recency
    this[LENGTH] = 0 // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE]

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0
    const len = this[LENGTH_CALCULATOR](value, key)

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key))
        return false
      }

      const node = this[CACHE].get(key)
      const item = node.value

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value)
      }

      item.now = now
      item.maxAge = maxAge
      item.value = value
      this[LENGTH] += len - item.length
      item.length = len
      this.get(key)
      trim(this)
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge)

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value)

      return false
    }

    this[LENGTH] += hit.length
    this[LRU_LIST].unshift(hit)
    this[CACHE].set(key, this[LRU_LIST].head)
    trim(this)
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail
    if (!node)
      return null

    del(this, node)
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key))
  }

  load (arr) {
    // reset the cache
    this.reset()

    const now = Date.now()
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l]
      const expiresAt = hit.e || 0
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v)
      else {
        const maxAge = expiresAt - now
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge)
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false))
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key)
  if (node) {
    const hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now()
        self[LRU_LIST].unshiftNode(node)
      }
    }
    return hit.value
  }
}

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
}

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

const del = (self, node) => {
  if (node) {
    const hit = node.value
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value)

    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key
    this.value = value
    this.length = length
    this.now = now
    this.maxAge = maxAge || 0
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE])
      hit = undefined
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self)
}

module.exports = LRUCache


/***/ }),

/***/ 2621:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const { PassThrough } = __nccwpck_require__(2781);

module.exports = function (/*streams...*/) {
  var sources = []
  var output  = new PassThrough({objectMode: true})

  output.setMaxListeners(0)

  output.add = add
  output.isEmpty = isEmpty

  output.on('unpipe', remove)

  Array.prototype.slice.call(arguments).forEach(add)

  return output

  function add (source) {
    if (Array.isArray(source)) {
      source.forEach(add)
      return this
    }

    sources.push(source);
    source.once('end', remove.bind(null, source))
    source.once('error', output.emit.bind(output, 'error'))
    source.pipe(output, {end: false})
    return this
  }

  function isEmpty () {
    return sources.length == 0;
  }

  function remove (source) {
    sources = sources.filter(function (it) { return it !== source })
    if (!sources.length && output.readable) { output.end() }
  }
}


/***/ }),

/***/ 4128:
/***/ ((module) => {

module.exports = () => {
	// https://mths.be/emoji
	return /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC2\uDECE-\uDEDB\uDEE0-\uDEE8]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g;
};


/***/ }),

/***/ 539:
/***/ ((module) => {



const pathKey = (options = {}) => {
	const environment = options.env || process.env;
	const platform = options.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(environment).reverse().find(key => key.toUpperCase() === 'PATH') || 'Path';
};

module.exports = pathKey;
// TODO: Remove this for the next major release
module.exports["default"] = pathKey;


/***/ }),

/***/ 8786:
/***/ ((module) => {



const mimicFn = (to, from) => {
	for (const prop of Reflect.ownKeys(from)) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}

	return to;
};

module.exports = mimicFn;
// TODO: Remove this for the next major release
module.exports["default"] = mimicFn;


/***/ }),

/***/ 4536:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const mimicFn = __nccwpck_require__(8786);

const calledFunctions = new WeakMap();

const onetime = (function_, options = {}) => {
	if (typeof function_ !== 'function') {
		throw new TypeError('Expected a function');
	}

	let returnValue;
	let callCount = 0;
	const functionName = function_.displayName || function_.name || '<anonymous>';

	const onetime = function (...arguments_) {
		calledFunctions.set(onetime, ++callCount);

		if (callCount === 1) {
			returnValue = function_.apply(this, arguments_);
			function_ = null;
		} else if (options.throw === true) {
			throw new Error(`Function \`${functionName}\` can only be called once`);
		}

		return returnValue;
	};

	mimicFn(onetime, function_);
	calledFunctions.set(onetime, callCount);

	return onetime;
};

module.exports = onetime;
// TODO: Remove this for the next major release
module.exports["default"] = onetime;

module.exports.callCount = function_ => {
	if (!calledFunctions.has(function_)) {
		throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
	}

	return calledFunctions.get(function_);
};


/***/ }),

/***/ 1532:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }

  constructor (comp, options) {
    options = parseOptions(options)

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    comp = comp.trim().split(/\s+/).join(' ')
    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver)
    }

    options = parseOptions(options)

    // Special cases where nothing can possibly be lower
    if (options.includePrerelease &&
      (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
      return false
    }
    if (!options.includePrerelease &&
      (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
      return false
    }

    // Same direction increasing (> or >=)
    if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
      return true
    }
    // Same direction decreasing (< or <=)
    if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
      return true
    }
    // same SemVer and both sides are inclusive (<= or >=)
    if (
      (this.semver.version === comp.semver.version) &&
      this.operator.includes('=') && comp.operator.includes('=')) {
      return true
    }
    // opposite directions less than
    if (cmp(this.semver, '<', comp.semver, options) &&
      this.operator.startsWith('>') && comp.operator.startsWith('<')) {
      return true
    }
    // opposite directions greater than
    if (cmp(this.semver, '>', comp.semver, options) &&
      this.operator.startsWith('<') && comp.operator.startsWith('>')) {
      return true
    }
    return false
  }
}

module.exports = Comparator

const parseOptions = __nccwpck_require__(785)
const { safeRe: re, t } = __nccwpck_require__(9523)
const cmp = __nccwpck_require__(5098)
const debug = __nccwpck_require__(427)
const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)


/***/ }),

/***/ 9828:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    options = parseOptions(options)

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof Comparator) {
      // just put it in the set and return
      this.raw = range.value
      this.set = [[range]]
      this.format()
      return this
    }

    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease

    // First reduce all whitespace as much as possible so we do not have to rely
    // on potentially slow regexes like \s*. This is then stored and used for
    // future error messages as well.
    this.raw = range
      .trim()
      .split(/\s+/)
      .join(' ')

    // First, split on ||
    this.set = this.raw
      .split('||')
      // map the range to a 2d array of comparators
      .map(r => this.parseRange(r.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length)

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${this.raw}`)
    }

    // if we have any that are not the null set, throw out null sets.
    if (this.set.length > 1) {
      // keep the first one, in case they're all null sets
      const first = this.set[0]
      this.set = this.set.filter(c => !isNullSet(c[0]))
      if (this.set.length === 0) {
        this.set = [first]
      } else if (this.set.length > 1) {
        // if we have any that are *, then the range is just *
        for (const c of this.set) {
          if (c.length === 1 && isAny(c[0])) {
            this.set = [c]
            break
          }
        }
      }
    }

    this.format()
  }

  format () {
    this.range = this.set
      .map((comps) => comps.join(' ').trim())
      .join('||')
      .trim()
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts =
      (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) |
      (this.options.loose && FLAG_LOOSE)
    const memoKey = memoOpts + ':' + range
    const cached = cache.get(memoKey)
    if (cached) {
      return cached
    }

    const loose = this.options.loose
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease))
    debug('hyphen replace', range)

    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
    debug('comparator trim', range)

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace)
    debug('tilde trim', range)

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace)
    debug('caret trim', range)

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    let rangeList = range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      // >=0.0.0 is equivalent to *
      .map(comp => replaceGTE0(comp, this.options))

    if (loose) {
      // in loose mode, throw out any that are not valid comparators
      rangeList = rangeList.filter(comp => {
        debug('loose invalid filter', comp, this.options)
        return !!comp.match(re[t.COMPARATORLOOSE])
      })
    }
    debug('range list', rangeList)

    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    const rangeMap = new Map()
    const comparators = rangeList.map(comp => new Comparator(comp, this.options))
    for (const comp of comparators) {
      if (isNullSet(comp)) {
        return [comp]
      }
      rangeMap.set(comp.value, comp)
    }
    if (rangeMap.size > 1 && rangeMap.has('')) {
      rangeMap.delete('')
    }

    const result = [...rangeMap.values()]
    cache.set(memoKey, result)
    return result
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}

module.exports = Range

const LRU = __nccwpck_require__(7129)
const cache = new LRU({ max: 1000 })

const parseOptions = __nccwpck_require__(785)
const Comparator = __nccwpck_require__(1532)
const debug = __nccwpck_require__(427)
const SemVer = __nccwpck_require__(8088)
const {
  safeRe: re,
  t,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace,
} = __nccwpck_require__(9523)
const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = __nccwpck_require__(2293)

const isNullSet = c => c.value === '<0.0.0-0'
const isAny = c => c.value === ''

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true
  const remainingComparators = comparators.slice()
  let testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

const isX = id => !id || id.toLowerCase() === 'x' || id === '*'

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceTilde(c, options))
    .join(' ')
}

const replaceTilde = (comp, options) => {
  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('tilde', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceCaret(c, options))
    .join(' ')
}

const replaceCaret = (comp, options) => {
  debug('caret', comp, options)
  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  const z = options.includePrerelease ? '-0' : ''
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('caret', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`
      }
    }

    debug('caret return', ret)
    return ret
  })
}

const replaceXRanges = (comp, options) => {
  debug('replaceXRanges', comp, options)
  return comp
    .split(/\s+/)
    .map((c) => replaceXRange(c, options))
    .join(' ')
}

const replaceXRange = (comp, options) => {
  comp = comp.trim()
  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    const xM = isX(M)
    const xm = xM || isX(m)
    const xp = xm || isX(p)
    const anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      if (gtlt === '<') {
        pr = '-0'
      }

      ret = `${gtlt + M}.${m}.${p}${pr}`
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp
    .trim()
    .replace(re[t.STAR], '')
}

const replaceGTE0 = (comp, options) => {
  debug('replaceGTE0', comp, options)
  return comp
    .trim()
    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`
  } else if (fpr) {
    from = `>=${from}`
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`
  } else {
    to = `<=${to}`
  }

  return `${from} ${to}`.trim()
}

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === Comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}


/***/ }),

/***/ 8088:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const debug = __nccwpck_require__(427)
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __nccwpck_require__(2293)
const { safeRe: re, t } = __nccwpck_require__(9523)

const parseOptions = __nccwpck_require__(785)
const { compareIdentifiers } = __nccwpck_require__(2463)
class SemVer {
  constructor (version, options) {
    options = parseOptions(options)

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version

    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }

    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options)
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0
    do {
      const a = this.prerelease[i]
      const b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    let i = 0
    do {
      const a = this.build[i]
      const b = other.build[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier, identifierBase) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier, identifierBase)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier, identifierBase)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier, identifierBase)
        this.inc('pre', identifier, identifierBase)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier, identifierBase)
        }
        this.inc('pre', identifier, identifierBase)
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre': {
        const base = Number(identifierBase) ? 1 : 0

        if (!identifier && identifierBase === false) {
          throw new Error('invalid increment argument: identifier is empty')
        }

        if (this.prerelease.length === 0) {
          this.prerelease = [base]
        } else {
          let i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            if (identifier === this.prerelease.join('.') && identifierBase === false) {
              throw new Error('invalid increment argument: identifier already exists')
            }
            this.prerelease.push(base)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          let prerelease = [identifier, base]
          if (identifierBase === false) {
            prerelease = [identifier]
          }
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = prerelease
            }
          } else {
            this.prerelease = prerelease
          }
        }
        break
      }
      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.raw = this.format()
    if (this.build.length) {
      this.raw += `+${this.build.join('.')}`
    }
    return this
  }
}

module.exports = SemVer


/***/ }),

/***/ 8848:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const clean = (version, options) => {
  const s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}
module.exports = clean


/***/ }),

/***/ 5098:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const eq = __nccwpck_require__(1898)
const neq = __nccwpck_require__(6017)
const gt = __nccwpck_require__(4123)
const gte = __nccwpck_require__(5522)
const lt = __nccwpck_require__(194)
const lte = __nccwpck_require__(7520)

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a === b

    case '!==':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
}
module.exports = cmp


/***/ }),

/***/ 3466:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const parse = __nccwpck_require__(5925)
const { safeRe: re, t } = __nccwpck_require__(9523)

const coerce = (version, options) => {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  let match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    let next
    while ((next = re[t.COERCERTL].exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options)
}
module.exports = coerce


/***/ }),

/***/ 2156:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const compareBuild = (a, b, loose) => {
  const versionA = new SemVer(a, loose)
  const versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}
module.exports = compareBuild


/***/ }),

/***/ 2804:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const compareLoose = (a, b) => compare(a, b, true)
module.exports = compareLoose


/***/ }),

/***/ 4309:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare


/***/ }),

/***/ 4297:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)

const diff = (version1, version2) => {
  const v1 = parse(version1, null, true)
  const v2 = parse(version2, null, true)
  const comparison = v1.compare(v2)

  if (comparison === 0) {
    return null
  }

  const v1Higher = comparison > 0
  const highVersion = v1Higher ? v1 : v2
  const lowVersion = v1Higher ? v2 : v1
  const highHasPre = !!highVersion.prerelease.length
  const lowHasPre = !!lowVersion.prerelease.length

  if (lowHasPre && !highHasPre) {
    // Going from prerelease -> no prerelease requires some special casing

    // If the low version has only a major, then it will always be a major
    // Some examples:
    // 1.0.0-1 -> 1.0.0
    // 1.0.0-1 -> 1.1.1
    // 1.0.0-1 -> 2.0.0
    if (!lowVersion.patch && !lowVersion.minor) {
      return 'major'
    }

    // Otherwise it can be determined by checking the high version

    if (highVersion.patch) {
      // anything higher than a patch bump would result in the wrong version
      return 'patch'
    }

    if (highVersion.minor) {
      // anything higher than a minor bump would result in the wrong version
      return 'minor'
    }

    // bumping major/minor/patch all have same result
    return 'major'
  }

  // add the `pre` prefix if we are going to a prerelease version
  const prefix = highHasPre ? 'pre' : ''

  if (v1.major !== v2.major) {
    return prefix + 'major'
  }

  if (v1.minor !== v2.minor) {
    return prefix + 'minor'
  }

  if (v1.patch !== v2.patch) {
    return prefix + 'patch'
  }

  // high and low are preleases
  return 'prerelease'
}

module.exports = diff


/***/ }),

/***/ 1898:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const eq = (a, b, loose) => compare(a, b, loose) === 0
module.exports = eq


/***/ }),

/***/ 4123:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const gt = (a, b, loose) => compare(a, b, loose) > 0
module.exports = gt


/***/ }),

/***/ 5522:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte


/***/ }),

/***/ 900:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)

const inc = (version, release, options, identifier, identifierBase) => {
  if (typeof (options) === 'string') {
    identifierBase = identifier
    identifier = options
    options = undefined
  }

  try {
    return new SemVer(
      version instanceof SemVer ? version.version : version,
      options
    ).inc(release, identifier, identifierBase).version
  } catch (er) {
    return null
  }
}
module.exports = inc


/***/ }),

/***/ 194:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const lt = (a, b, loose) => compare(a, b, loose) < 0
module.exports = lt


/***/ }),

/***/ 7520:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const lte = (a, b, loose) => compare(a, b, loose) <= 0
module.exports = lte


/***/ }),

/***/ 6688:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const major = (a, loose) => new SemVer(a, loose).major
module.exports = major


/***/ }),

/***/ 8447:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const minor = (a, loose) => new SemVer(a, loose).minor
module.exports = minor


/***/ }),

/***/ 6017:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const neq = (a, b, loose) => compare(a, b, loose) !== 0
module.exports = neq


/***/ }),

/***/ 5925:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const parse = (version, options, throwErrors = false) => {
  if (version instanceof SemVer) {
    return version
  }
  try {
    return new SemVer(version, options)
  } catch (er) {
    if (!throwErrors) {
      return null
    }
    throw er
  }
}

module.exports = parse


/***/ }),

/***/ 2866:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const patch = (a, loose) => new SemVer(a, loose).patch
module.exports = patch


/***/ }),

/***/ 4016:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const prerelease = (version, options) => {
  const parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}
module.exports = prerelease


/***/ }),

/***/ 6417:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const rcompare = (a, b, loose) => compare(b, a, loose)
module.exports = rcompare


/***/ }),

/***/ 8701:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compareBuild = __nccwpck_require__(2156)
const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
module.exports = rsort


/***/ }),

/***/ 6055:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const satisfies = (version, range, options) => {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}
module.exports = satisfies


/***/ }),

/***/ 1426:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compareBuild = __nccwpck_require__(2156)
const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
module.exports = sort


/***/ }),

/***/ 9601:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const valid = (version, options) => {
  const v = parse(version, options)
  return v ? v.version : null
}
module.exports = valid


/***/ }),

/***/ 1383:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// just pre-load all the stuff that index.js lazily exports
const internalRe = __nccwpck_require__(9523)
const constants = __nccwpck_require__(2293)
const SemVer = __nccwpck_require__(8088)
const identifiers = __nccwpck_require__(2463)
const parse = __nccwpck_require__(5925)
const valid = __nccwpck_require__(9601)
const clean = __nccwpck_require__(8848)
const inc = __nccwpck_require__(900)
const diff = __nccwpck_require__(4297)
const major = __nccwpck_require__(6688)
const minor = __nccwpck_require__(8447)
const patch = __nccwpck_require__(2866)
const prerelease = __nccwpck_require__(4016)
const compare = __nccwpck_require__(4309)
const rcompare = __nccwpck_require__(6417)
const compareLoose = __nccwpck_require__(2804)
const compareBuild = __nccwpck_require__(2156)
const sort = __nccwpck_require__(1426)
const rsort = __nccwpck_require__(8701)
const gt = __nccwpck_require__(4123)
const lt = __nccwpck_require__(194)
const eq = __nccwpck_require__(1898)
const neq = __nccwpck_require__(6017)
const gte = __nccwpck_require__(5522)
const lte = __nccwpck_require__(7520)
const cmp = __nccwpck_require__(5098)
const coerce = __nccwpck_require__(3466)
const Comparator = __nccwpck_require__(1532)
const Range = __nccwpck_require__(9828)
const satisfies = __nccwpck_require__(6055)
const toComparators = __nccwpck_require__(2706)
const maxSatisfying = __nccwpck_require__(579)
const minSatisfying = __nccwpck_require__(832)
const minVersion = __nccwpck_require__(4179)
const validRange = __nccwpck_require__(2098)
const outside = __nccwpck_require__(420)
const gtr = __nccwpck_require__(9380)
const ltr = __nccwpck_require__(3323)
const intersects = __nccwpck_require__(7008)
const simplifyRange = __nccwpck_require__(5297)
const subset = __nccwpck_require__(7863)
module.exports = {
  parse,
  valid,
  clean,
  inc,
  diff,
  major,
  minor,
  patch,
  prerelease,
  compare,
  rcompare,
  compareLoose,
  compareBuild,
  sort,
  rsort,
  gt,
  lt,
  eq,
  neq,
  gte,
  lte,
  cmp,
  coerce,
  Comparator,
  Range,
  satisfies,
  toComparators,
  maxSatisfying,
  minSatisfying,
  minVersion,
  validRange,
  outside,
  gtr,
  ltr,
  intersects,
  simplifyRange,
  subset,
  SemVer,
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: constants.RELEASE_TYPES,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers,
}


/***/ }),

/***/ 2293:
/***/ ((module) => {

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6

const RELEASE_TYPES = [
  'major',
  'premajor',
  'minor',
  'preminor',
  'patch',
  'prepatch',
  'prerelease',
]

module.exports = {
  MAX_LENGTH,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  FLAG_INCLUDE_PRERELEASE: 0b001,
  FLAG_LOOSE: 0b010,
}


/***/ }),

/***/ 427:
/***/ ((module) => {

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

module.exports = debug


/***/ }),

/***/ 2463:
/***/ ((module) => {

const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  const anum = numeric.test(a)
  const bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)

module.exports = {
  compareIdentifiers,
  rcompareIdentifiers,
}


/***/ }),

/***/ 785:
/***/ ((module) => {

// parse out just the options we care about
const looseOption = Object.freeze({ loose: true })
const emptyOpts = Object.freeze({ })
const parseOptions = options => {
  if (!options) {
    return emptyOpts
  }

  if (typeof options !== 'object') {
    return looseOption
  }

  return options
}
module.exports = parseOptions


/***/ }),

/***/ 9523:
/***/ ((module, exports, __nccwpck_require__) => {

const {
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_LENGTH,
} = __nccwpck_require__(2293)
const debug = __nccwpck_require__(427)
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const safeRe = exports.safeRe = []
const src = exports.src = []
const t = exports.t = {}
let R = 0

const LETTERDASHNUMBER = '[a-zA-Z0-9-]'

// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
const safeRegexReplacements = [
  ['\\s', 1],
  ['\\d', MAX_LENGTH],
  [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH],
]

const makeSafeRegex = (value) => {
  for (const [token, max] of safeRegexReplacements) {
    value = value
      .split(`${token}*`).join(`${token}{0,${max}}`)
      .split(`${token}+`).join(`${token}{1,${max}}`)
  }
  return value
}

const createToken = (name, value, isGlobal) => {
  const safe = makeSafeRegex(value)
  const index = R++
  debug(name, index, value)
  t[name] = index
  src[index] = value
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined)
  safeRe[index] = new RegExp(safe, isGlobal ? 'g' : undefined)
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*')
createToken('NUMERICIDENTIFIERLOOSE', '\\d+')

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`)

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`)

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`)

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`)

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`)

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`)

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`)

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`)

createToken('FULL', `^${src[t.FULLPLAIN]}$`)

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`)

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`)

createToken('GTLT', '((?:<|>)?=?)')

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`)
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`)

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`)

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)')

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true)
exports.tildeTrimReplace = '$1~'

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)')

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true)
exports.caretTrimReplace = '$1^'

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`)
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true)
exports.comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`)

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`)

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*')
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$')
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$')


/***/ }),

/***/ 9380:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Determine if version is greater than all the versions possible in the range.
const outside = __nccwpck_require__(420)
const gtr = (version, range, options) => outside(version, range, '>', options)
module.exports = gtr


/***/ }),

/***/ 7008:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const intersects = (r1, r2, options) => {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2, options)
}
module.exports = intersects


/***/ }),

/***/ 3323:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const outside = __nccwpck_require__(420)
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside(version, range, '<', options)
module.exports = ltr


/***/ }),

/***/ 579:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)

const maxSatisfying = (versions, range, options) => {
  let max = null
  let maxSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}
module.exports = maxSatisfying


/***/ }),

/***/ 832:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)
const minSatisfying = (versions, range, options) => {
  let min = null
  let minSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}
module.exports = minSatisfying


/***/ }),

/***/ 4179:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)
const gt = __nccwpck_require__(4123)

const minVersion = (range, loose) => {
  range = new Range(range, loose)

  let minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let setMin = null
    comparators.forEach((comparator) => {
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!setMin || gt(compver, setMin)) {
            setMin = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error(`Unexpected operation: ${comparator.operator}`)
      }
    })
    if (setMin && (!minver || gt(minver, setMin))) {
      minver = setMin
    }
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}
module.exports = minVersion


/***/ }),

/***/ 420:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Comparator = __nccwpck_require__(1532)
const { ANY } = Comparator
const Range = __nccwpck_require__(9828)
const satisfies = __nccwpck_require__(6055)
const gt = __nccwpck_require__(4123)
const lt = __nccwpck_require__(194)
const lte = __nccwpck_require__(7520)
const gte = __nccwpck_require__(5522)

const outside = (version, range, hilo, options) => {
  version = new SemVer(version, options)
  range = new Range(range, options)

  let gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisfies the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let high = null
    let low = null

    comparators.forEach((comparator) => {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

module.exports = outside


/***/ }),

/***/ 5297:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = __nccwpck_require__(6055)
const compare = __nccwpck_require__(4309)
module.exports = (versions, range, options) => {
  const set = []
  let first = null
  let prev = null
  const v = versions.sort((a, b) => compare(a, b, options))
  for (const version of v) {
    const included = satisfies(version, range, options)
    if (included) {
      prev = version
      if (!first) {
        first = version
      }
    } else {
      if (prev) {
        set.push([first, prev])
      }
      prev = null
      first = null
    }
  }
  if (first) {
    set.push([first, null])
  }

  const ranges = []
  for (const [min, max] of set) {
    if (min === max) {
      ranges.push(min)
    } else if (!max && min === v[0]) {
      ranges.push('*')
    } else if (!max) {
      ranges.push(`>=${min}`)
    } else if (min === v[0]) {
      ranges.push(`<=${max}`)
    } else {
      ranges.push(`${min} - ${max}`)
    }
  }
  const simplified = ranges.join(' || ')
  const original = typeof range.raw === 'string' ? range.raw : String(range)
  return simplified.length < original.length ? simplified : range
}


/***/ }),

/***/ 7863:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const Comparator = __nccwpck_require__(1532)
const { ANY } = Comparator
const satisfies = __nccwpck_require__(6055)
const compare = __nccwpck_require__(4309)

// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true

const subset = (sub, dom, options = {}) => {
  if (sub === dom) {
    return true
  }

  sub = new Range(sub, options)
  dom = new Range(dom, options)
  let sawNonNull = false

  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options)
      sawNonNull = sawNonNull || isSub !== null
      if (isSub) {
        continue OUTER
      }
    }
    // the null set is a subset of everything, but null simple ranges in
    // a complex range should be ignored.  so if we saw a non-null range,
    // then we know this isn't a subset, but if EVERY simple range was null,
    // then it is a subset.
    if (sawNonNull) {
      return false
    }
  }
  return true
}

const minimumVersionWithPreRelease = [new Comparator('>=0.0.0-0')]
const minimumVersion = [new Comparator('>=0.0.0')]

const simpleSubset = (sub, dom, options) => {
  if (sub === dom) {
    return true
  }

  if (sub.length === 1 && sub[0].semver === ANY) {
    if (dom.length === 1 && dom[0].semver === ANY) {
      return true
    } else if (options.includePrerelease) {
      sub = minimumVersionWithPreRelease
    } else {
      sub = minimumVersion
    }
  }

  if (dom.length === 1 && dom[0].semver === ANY) {
    if (options.includePrerelease) {
      return true
    } else {
      dom = minimumVersion
    }
  }

  const eqSet = new Set()
  let gt, lt
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=') {
      gt = higherGT(gt, c, options)
    } else if (c.operator === '<' || c.operator === '<=') {
      lt = lowerLT(lt, c, options)
    } else {
      eqSet.add(c.semver)
    }
  }

  if (eqSet.size > 1) {
    return null
  }

  let gtltComp
  if (gt && lt) {
    gtltComp = compare(gt.semver, lt.semver, options)
    if (gtltComp > 0) {
      return null
    } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
      return null
    }
  }

  // will iterate one or zero times
  for (const eq of eqSet) {
    if (gt && !satisfies(eq, String(gt), options)) {
      return null
    }

    if (lt && !satisfies(eq, String(lt), options)) {
      return null
    }

    for (const c of dom) {
      if (!satisfies(eq, String(c), options)) {
        return false
      }
    }

    return true
  }

  let higher, lower
  let hasDomLT, hasDomGT
  // if the subset has a prerelease, we need a comparator in the superset
  // with the same tuple and a prerelease, or it's not a subset
  let needDomLTPre = lt &&
    !options.includePrerelease &&
    lt.semver.prerelease.length ? lt.semver : false
  let needDomGTPre = gt &&
    !options.includePrerelease &&
    gt.semver.prerelease.length ? gt.semver : false
  // exception: <1.2.3-0 is the same as <1.2.3
  if (needDomLTPre && needDomLTPre.prerelease.length === 1 &&
      lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
    needDomLTPre = false
  }

  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>='
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<='
    if (gt) {
      if (needDomGTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomGTPre.major &&
            c.semver.minor === needDomGTPre.minor &&
            c.semver.patch === needDomGTPre.patch) {
          needDomGTPre = false
        }
      }
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c, options)
        if (higher === c && higher !== gt) {
          return false
        }
      } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options)) {
        return false
      }
    }
    if (lt) {
      if (needDomLTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomLTPre.major &&
            c.semver.minor === needDomLTPre.minor &&
            c.semver.patch === needDomLTPre.patch) {
          needDomLTPre = false
        }
      }
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c, options)
        if (lower === c && lower !== lt) {
          return false
        }
      } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options)) {
        return false
      }
    }
    if (!c.operator && (lt || gt) && gtltComp !== 0) {
      return false
    }
  }

  // if there was a < or >, and nothing in the dom, then must be false
  // UNLESS it was limited by another range in the other direction.
  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  if (gt && hasDomLT && !lt && gtltComp !== 0) {
    return false
  }

  if (lt && hasDomGT && !gt && gtltComp !== 0) {
    return false
  }

  // we needed a prerelease range in a specific tuple, but didn't get one
  // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
  // because it includes prereleases in the 1.2.3 tuple
  if (needDomGTPre || needDomLTPre) {
    return false
  }

  return true
}

// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp > 0 ? a
    : comp < 0 ? b
    : b.operator === '>' && a.operator === '>=' ? b
    : a
}

// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp < 0 ? a
    : comp > 0 ? b
    : b.operator === '<' && a.operator === '<=' ? b
    : a
}

module.exports = subset


/***/ }),

/***/ 2706:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)

// Mostly just for testing and legacy API reasons
const toComparators = (range, options) =>
  new Range(range, options).set
    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '))

module.exports = toComparators


/***/ }),

/***/ 2098:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const validRange = (range, options) => {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}
module.exports = validRange


/***/ }),

/***/ 7032:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const shebangRegex = __nccwpck_require__(2638);

module.exports = (string = '') => {
	const match = string.match(shebangRegex);

	if (!match) {
		return null;
	}

	const [path, argument] = match[0].replace(/#! ?/, '').split(' ');
	const binary = path.split('/').pop();

	if (binary === 'env') {
		return argument;
	}

	return argument ? `${binary} ${argument}` : binary;
};


/***/ }),

/***/ 2638:
/***/ ((module) => {


module.exports = /^#!(.*)/;


/***/ }),

/***/ 4931:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
// grab a reference to node's real process object right away
var process = global.process

const processOk = function (process) {
  return process &&
    typeof process === 'object' &&
    typeof process.removeListener === 'function' &&
    typeof process.emit === 'function' &&
    typeof process.reallyExit === 'function' &&
    typeof process.listeners === 'function' &&
    typeof process.kill === 'function' &&
    typeof process.pid === 'number' &&
    typeof process.on === 'function'
}

// some kind of non-node environment, just no-op
/* istanbul ignore if */
if (!processOk(process)) {
  module.exports = function () {
    return function () {}
  }
} else {
  var assert = __nccwpck_require__(9491)
  var signals = __nccwpck_require__(3710)
  var isWin = /^win/i.test(process.platform)

  var EE = __nccwpck_require__(2361)
  /* istanbul ignore if */
  if (typeof EE !== 'function') {
    EE = EE.EventEmitter
  }

  var emitter
  if (process.__signal_exit_emitter__) {
    emitter = process.__signal_exit_emitter__
  } else {
    emitter = process.__signal_exit_emitter__ = new EE()
    emitter.count = 0
    emitter.emitted = {}
  }

  // Because this emitter is a global, we have to check to see if a
  // previous version of this library failed to enable infinite listeners.
  // I know what you're about to say.  But literally everything about
  // signal-exit is a compromise with evil.  Get used to it.
  if (!emitter.infinite) {
    emitter.setMaxListeners(Infinity)
    emitter.infinite = true
  }

  module.exports = function (cb, opts) {
    /* istanbul ignore if */
    if (!processOk(global.process)) {
      return function () {}
    }
    assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler')

    if (loaded === false) {
      load()
    }

    var ev = 'exit'
    if (opts && opts.alwaysLast) {
      ev = 'afterexit'
    }

    var remove = function () {
      emitter.removeListener(ev, cb)
      if (emitter.listeners('exit').length === 0 &&
          emitter.listeners('afterexit').length === 0) {
        unload()
      }
    }
    emitter.on(ev, cb)

    return remove
  }

  var unload = function unload () {
    if (!loaded || !processOk(global.process)) {
      return
    }
    loaded = false

    signals.forEach(function (sig) {
      try {
        process.removeListener(sig, sigListeners[sig])
      } catch (er) {}
    })
    process.emit = originalProcessEmit
    process.reallyExit = originalProcessReallyExit
    emitter.count -= 1
  }
  module.exports.unload = unload

  var emit = function emit (event, code, signal) {
    /* istanbul ignore if */
    if (emitter.emitted[event]) {
      return
    }
    emitter.emitted[event] = true
    emitter.emit(event, code, signal)
  }

  // { <signal>: <listener fn>, ... }
  var sigListeners = {}
  signals.forEach(function (sig) {
    sigListeners[sig] = function listener () {
      /* istanbul ignore if */
      if (!processOk(global.process)) {
        return
      }
      // If there are no other listeners, an exit is coming!
      // Simplest way: remove us and then re-send the signal.
      // We know that this will kill the process, so we can
      // safely emit now.
      var listeners = process.listeners(sig)
      if (listeners.length === emitter.count) {
        unload()
        emit('exit', null, sig)
        /* istanbul ignore next */
        emit('afterexit', null, sig)
        /* istanbul ignore next */
        if (isWin && sig === 'SIGHUP') {
          // "SIGHUP" throws an `ENOSYS` error on Windows,
          // so use a supported signal instead
          sig = 'SIGINT'
        }
        /* istanbul ignore next */
        process.kill(process.pid, sig)
      }
    }
  })

  module.exports.signals = function () {
    return signals
  }

  var loaded = false

  var load = function load () {
    if (loaded || !processOk(global.process)) {
      return
    }
    loaded = true

    // This is the number of onSignalExit's that are in play.
    // It's important so that we can count the correct number of
    // listeners on signals, and don't wait for the other one to
    // handle it instead of us.
    emitter.count += 1

    signals = signals.filter(function (sig) {
      try {
        process.on(sig, sigListeners[sig])
        return true
      } catch (er) {
        return false
      }
    })

    process.emit = processEmit
    process.reallyExit = processReallyExit
  }
  module.exports.load = load

  var originalProcessReallyExit = process.reallyExit
  var processReallyExit = function processReallyExit (code) {
    /* istanbul ignore if */
    if (!processOk(global.process)) {
      return
    }
    process.exitCode = code || /* istanbul ignore next */ 0
    emit('exit', process.exitCode, null)
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null)
    /* istanbul ignore next */
    originalProcessReallyExit.call(process, process.exitCode)
  }

  var originalProcessEmit = process.emit
  var processEmit = function processEmit (ev, arg) {
    if (ev === 'exit' && processOk(global.process)) {
      /* istanbul ignore else */
      if (arg !== undefined) {
        process.exitCode = arg
      }
      var ret = originalProcessEmit.apply(this, arguments)
      /* istanbul ignore next */
      emit('exit', process.exitCode, null)
      /* istanbul ignore next */
      emit('afterexit', process.exitCode, null)
      /* istanbul ignore next */
      return ret
    } else {
      return originalProcessEmit.apply(this, arguments)
    }
  }
}


/***/ }),

/***/ 3710:
/***/ ((module) => {

// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
]

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  )
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  )
}


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 4207:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

const path = __nccwpck_require__(1017)
const COLON = isWindows ? ';' : ':'
const isexe = __nccwpck_require__(7126)

const getNotFoundError = (cmd) =>
  Object.assign(new Error(`not found: ${cmd}`), { code: 'ENOENT' })

const getPathInfo = (cmd, opt) => {
  const colon = opt.colon || COLON

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? ['']
    : (
      [
        // windows always checks the cwd first
        ...(isWindows ? [process.cwd()] : []),
        ...(opt.path || process.env.PATH ||
          /* istanbul ignore next: very unusual */ '').split(colon),
      ]
    )
  const pathExtExe = isWindows
    ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM'
    : ''
  const pathExt = isWindows ? pathExtExe.split(colon) : ['']

  if (isWindows) {
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  return {
    pathEnv,
    pathExt,
    pathExtExe,
  }
}

const which = (cmd, opt, cb) => {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }
  if (!opt)
    opt = {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  const step = i => new Promise((resolve, reject) => {
    if (i === pathEnv.length)
      return opt.all && found.length ? resolve(found)
        : reject(getNotFoundError(cmd))

    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    resolve(subStep(p, i, 0))
  })

  const subStep = (p, i, ii) => new Promise((resolve, reject) => {
    if (ii === pathExt.length)
      return resolve(step(i + 1))
    const ext = pathExt[ii]
    isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
      if (!er && is) {
        if (opt.all)
          found.push(p + ext)
        else
          return resolve(p + ext)
      }
      return resolve(subStep(p, i, ii + 1))
    })
  })

  return cb ? step(0).then(res => cb(null, res), cb) : step(0)
}

const whichSync = (cmd, opt) => {
  opt = opt || {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  for (let i = 0; i < pathEnv.length; i ++) {
    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    for (let j = 0; j < pathExt.length; j ++) {
      const cur = p + pathExt[j]
      try {
        const is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}

module.exports = which
which.sync = whichSync


/***/ }),

/***/ 4091:
/***/ ((module) => {


module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value
    }
  }
}


/***/ }),

/***/ 665:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null

  return next
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next
  }

  var ret = []
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value)
    walker = this.removeNode(walker)
  }
  if (walker === null) {
    walker = this.tail
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i])
  }
  return ret;
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self)

  if (inserted.next === null) {
    self.tail = inserted
  }
  if (inserted.prev === null) {
    self.head = inserted
  }

  self.length++

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}

try {
  // add if support for Symbol.iterator is present
  __nccwpck_require__(4091)(Yallist)
} catch (er) {}


/***/ }),

/***/ 9491:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("assert");

/***/ }),

/***/ 2081:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("child_process");

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");

/***/ }),

/***/ 2781:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("stream");

/***/ }),

/***/ 4404:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("util");

/***/ }),

/***/ 6374:
/***/ ((module) => {

module.exports = JSON.parse('{"dots":{"interval":80,"frames":["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"]},"dots2":{"interval":80,"frames":["⣾","⣽","⣻","⢿","⡿","⣟","⣯","⣷"]},"dots3":{"interval":80,"frames":["⠋","⠙","⠚","⠞","⠖","⠦","⠴","⠲","⠳","⠓"]},"dots4":{"interval":80,"frames":["⠄","⠆","⠇","⠋","⠙","⠸","⠰","⠠","⠰","⠸","⠙","⠋","⠇","⠆"]},"dots5":{"interval":80,"frames":["⠋","⠙","⠚","⠒","⠂","⠂","⠒","⠲","⠴","⠦","⠖","⠒","⠐","⠐","⠒","⠓","⠋"]},"dots6":{"interval":80,"frames":["⠁","⠉","⠙","⠚","⠒","⠂","⠂","⠒","⠲","⠴","⠤","⠄","⠄","⠤","⠴","⠲","⠒","⠂","⠂","⠒","⠚","⠙","⠉","⠁"]},"dots7":{"interval":80,"frames":["⠈","⠉","⠋","⠓","⠒","⠐","⠐","⠒","⠖","⠦","⠤","⠠","⠠","⠤","⠦","⠖","⠒","⠐","⠐","⠒","⠓","⠋","⠉","⠈"]},"dots8":{"interval":80,"frames":["⠁","⠁","⠉","⠙","⠚","⠒","⠂","⠂","⠒","⠲","⠴","⠤","⠄","⠄","⠤","⠠","⠠","⠤","⠦","⠖","⠒","⠐","⠐","⠒","⠓","⠋","⠉","⠈","⠈"]},"dots9":{"interval":80,"frames":["⢹","⢺","⢼","⣸","⣇","⡧","⡗","⡏"]},"dots10":{"interval":80,"frames":["⢄","⢂","⢁","⡁","⡈","⡐","⡠"]},"dots11":{"interval":100,"frames":["⠁","⠂","⠄","⡀","⢀","⠠","⠐","⠈"]},"dots12":{"interval":80,"frames":["⢀⠀","⡀⠀","⠄⠀","⢂⠀","⡂⠀","⠅⠀","⢃⠀","⡃⠀","⠍⠀","⢋⠀","⡋⠀","⠍⠁","⢋⠁","⡋⠁","⠍⠉","⠋⠉","⠋⠉","⠉⠙","⠉⠙","⠉⠩","⠈⢙","⠈⡙","⢈⠩","⡀⢙","⠄⡙","⢂⠩","⡂⢘","⠅⡘","⢃⠨","⡃⢐","⠍⡐","⢋⠠","⡋⢀","⠍⡁","⢋⠁","⡋⠁","⠍⠉","⠋⠉","⠋⠉","⠉⠙","⠉⠙","⠉⠩","⠈⢙","⠈⡙","⠈⠩","⠀⢙","⠀⡙","⠀⠩","⠀⢘","⠀⡘","⠀⠨","⠀⢐","⠀⡐","⠀⠠","⠀⢀","⠀⡀"]},"dots13":{"interval":80,"frames":["⣼","⣹","⢻","⠿","⡟","⣏","⣧","⣶"]},"dots8Bit":{"interval":80,"frames":["⠀","⠁","⠂","⠃","⠄","⠅","⠆","⠇","⡀","⡁","⡂","⡃","⡄","⡅","⡆","⡇","⠈","⠉","⠊","⠋","⠌","⠍","⠎","⠏","⡈","⡉","⡊","⡋","⡌","⡍","⡎","⡏","⠐","⠑","⠒","⠓","⠔","⠕","⠖","⠗","⡐","⡑","⡒","⡓","⡔","⡕","⡖","⡗","⠘","⠙","⠚","⠛","⠜","⠝","⠞","⠟","⡘","⡙","⡚","⡛","⡜","⡝","⡞","⡟","⠠","⠡","⠢","⠣","⠤","⠥","⠦","⠧","⡠","⡡","⡢","⡣","⡤","⡥","⡦","⡧","⠨","⠩","⠪","⠫","⠬","⠭","⠮","⠯","⡨","⡩","⡪","⡫","⡬","⡭","⡮","⡯","⠰","⠱","⠲","⠳","⠴","⠵","⠶","⠷","⡰","⡱","⡲","⡳","⡴","⡵","⡶","⡷","⠸","⠹","⠺","⠻","⠼","⠽","⠾","⠿","⡸","⡹","⡺","⡻","⡼","⡽","⡾","⡿","⢀","⢁","⢂","⢃","⢄","⢅","⢆","⢇","⣀","⣁","⣂","⣃","⣄","⣅","⣆","⣇","⢈","⢉","⢊","⢋","⢌","⢍","⢎","⢏","⣈","⣉","⣊","⣋","⣌","⣍","⣎","⣏","⢐","⢑","⢒","⢓","⢔","⢕","⢖","⢗","⣐","⣑","⣒","⣓","⣔","⣕","⣖","⣗","⢘","⢙","⢚","⢛","⢜","⢝","⢞","⢟","⣘","⣙","⣚","⣛","⣜","⣝","⣞","⣟","⢠","⢡","⢢","⢣","⢤","⢥","⢦","⢧","⣠","⣡","⣢","⣣","⣤","⣥","⣦","⣧","⢨","⢩","⢪","⢫","⢬","⢭","⢮","⢯","⣨","⣩","⣪","⣫","⣬","⣭","⣮","⣯","⢰","⢱","⢲","⢳","⢴","⢵","⢶","⢷","⣰","⣱","⣲","⣳","⣴","⣵","⣶","⣷","⢸","⢹","⢺","⢻","⢼","⢽","⢾","⢿","⣸","⣹","⣺","⣻","⣼","⣽","⣾","⣿"]},"sand":{"interval":80,"frames":["⠁","⠂","⠄","⡀","⡈","⡐","⡠","⣀","⣁","⣂","⣄","⣌","⣔","⣤","⣥","⣦","⣮","⣶","⣷","⣿","⡿","⠿","⢟","⠟","⡛","⠛","⠫","⢋","⠋","⠍","⡉","⠉","⠑","⠡","⢁"]},"line":{"interval":130,"frames":["-","\\\\","|","/"]},"line2":{"interval":100,"frames":["⠂","-","–","—","–","-"]},"pipe":{"interval":100,"frames":["┤","┘","┴","└","├","┌","┬","┐"]},"simpleDots":{"interval":400,"frames":[".  ",".. ","...","   "]},"simpleDotsScrolling":{"interval":200,"frames":[".  ",".. ","..."," ..","  .","   "]},"star":{"interval":70,"frames":["✶","✸","✹","✺","✹","✷"]},"star2":{"interval":80,"frames":["+","x","*"]},"flip":{"interval":70,"frames":["_","_","_","-","`","`","\'","´","-","_","_","_"]},"hamburger":{"interval":100,"frames":["☱","☲","☴"]},"growVertical":{"interval":120,"frames":["▁","▃","▄","▅","▆","▇","▆","▅","▄","▃"]},"growHorizontal":{"interval":120,"frames":["▏","▎","▍","▌","▋","▊","▉","▊","▋","▌","▍","▎"]},"balloon":{"interval":140,"frames":[" ",".","o","O","@","*"," "]},"balloon2":{"interval":120,"frames":[".","o","O","°","O","o","."]},"noise":{"interval":100,"frames":["▓","▒","░"]},"bounce":{"interval":120,"frames":["⠁","⠂","⠄","⠂"]},"boxBounce":{"interval":120,"frames":["▖","▘","▝","▗"]},"boxBounce2":{"interval":100,"frames":["▌","▀","▐","▄"]},"triangle":{"interval":50,"frames":["◢","◣","◤","◥"]},"binary":{"interval":80,"frames":["010010","001100","100101","111010","111101","010111","101011","111000","110011","110101"]},"arc":{"interval":100,"frames":["◜","◠","◝","◞","◡","◟"]},"circle":{"interval":120,"frames":["◡","⊙","◠"]},"squareCorners":{"interval":180,"frames":["◰","◳","◲","◱"]},"circleQuarters":{"interval":120,"frames":["◴","◷","◶","◵"]},"circleHalves":{"interval":50,"frames":["◐","◓","◑","◒"]},"squish":{"interval":100,"frames":["╫","╪"]},"toggle":{"interval":250,"frames":["⊶","⊷"]},"toggle2":{"interval":80,"frames":["▫","▪"]},"toggle3":{"interval":120,"frames":["□","■"]},"toggle4":{"interval":100,"frames":["■","□","▪","▫"]},"toggle5":{"interval":100,"frames":["▮","▯"]},"toggle6":{"interval":300,"frames":["ဝ","၀"]},"toggle7":{"interval":80,"frames":["⦾","⦿"]},"toggle8":{"interval":100,"frames":["◍","◌"]},"toggle9":{"interval":100,"frames":["◉","◎"]},"toggle10":{"interval":100,"frames":["㊂","㊀","㊁"]},"toggle11":{"interval":50,"frames":["⧇","⧆"]},"toggle12":{"interval":120,"frames":["☗","☖"]},"toggle13":{"interval":80,"frames":["=","*","-"]},"arrow":{"interval":100,"frames":["←","↖","↑","↗","→","↘","↓","↙"]},"arrow2":{"interval":80,"frames":["⬆️ ","↗️ ","➡️ ","↘️ ","⬇️ ","↙️ ","⬅️ ","↖️ "]},"arrow3":{"interval":120,"frames":["▹▹▹▹▹","▸▹▹▹▹","▹▸▹▹▹","▹▹▸▹▹","▹▹▹▸▹","▹▹▹▹▸"]},"bouncingBar":{"interval":80,"frames":["[    ]","[=   ]","[==  ]","[=== ]","[====]","[ ===]","[  ==]","[   =]","[    ]","[   =]","[  ==]","[ ===]","[====]","[=== ]","[==  ]","[=   ]"]},"bouncingBall":{"interval":80,"frames":["( ●    )","(  ●   )","(   ●  )","(    ● )","(     ●)","(    ● )","(   ●  )","(  ●   )","( ●    )","(●     )"]},"smiley":{"interval":200,"frames":["😄 ","😝 "]},"monkey":{"interval":300,"frames":["🙈 ","🙈 ","🙉 ","🙊 "]},"hearts":{"interval":100,"frames":["💛 ","💙 ","💜 ","💚 ","❤️ "]},"clock":{"interval":100,"frames":["🕛 ","🕐 ","🕑 ","🕒 ","🕓 ","🕔 ","🕕 ","🕖 ","🕗 ","🕘 ","🕙 ","🕚 "]},"earth":{"interval":180,"frames":["🌍 ","🌎 ","🌏 "]},"material":{"interval":17,"frames":["█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","███▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁","██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁","███████▁▁▁▁▁▁▁▁▁▁▁▁▁","████████▁▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","██████████▁▁▁▁▁▁▁▁▁▁","███████████▁▁▁▁▁▁▁▁▁","█████████████▁▁▁▁▁▁▁","██████████████▁▁▁▁▁▁","██████████████▁▁▁▁▁▁","▁██████████████▁▁▁▁▁","▁██████████████▁▁▁▁▁","▁██████████████▁▁▁▁▁","▁▁██████████████▁▁▁▁","▁▁▁██████████████▁▁▁","▁▁▁▁█████████████▁▁▁","▁▁▁▁██████████████▁▁","▁▁▁▁██████████████▁▁","▁▁▁▁▁██████████████▁","▁▁▁▁▁██████████████▁","▁▁▁▁▁██████████████▁","▁▁▁▁▁▁██████████████","▁▁▁▁▁▁██████████████","▁▁▁▁▁▁▁█████████████","▁▁▁▁▁▁▁█████████████","▁▁▁▁▁▁▁▁████████████","▁▁▁▁▁▁▁▁████████████","▁▁▁▁▁▁▁▁▁███████████","▁▁▁▁▁▁▁▁▁███████████","▁▁▁▁▁▁▁▁▁▁██████████","▁▁▁▁▁▁▁▁▁▁██████████","▁▁▁▁▁▁▁▁▁▁▁▁████████","▁▁▁▁▁▁▁▁▁▁▁▁▁███████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁██████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████","█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████","██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███","██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███","███▁▁▁▁▁▁▁▁▁▁▁▁▁▁███","████▁▁▁▁▁▁▁▁▁▁▁▁▁▁██","█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█","█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█","██████▁▁▁▁▁▁▁▁▁▁▁▁▁█","████████▁▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","█████████▁▁▁▁▁▁▁▁▁▁▁","███████████▁▁▁▁▁▁▁▁▁","████████████▁▁▁▁▁▁▁▁","████████████▁▁▁▁▁▁▁▁","██████████████▁▁▁▁▁▁","██████████████▁▁▁▁▁▁","▁██████████████▁▁▁▁▁","▁██████████████▁▁▁▁▁","▁▁▁█████████████▁▁▁▁","▁▁▁▁▁████████████▁▁▁","▁▁▁▁▁████████████▁▁▁","▁▁▁▁▁▁███████████▁▁▁","▁▁▁▁▁▁▁▁█████████▁▁▁","▁▁▁▁▁▁▁▁█████████▁▁▁","▁▁▁▁▁▁▁▁▁█████████▁▁","▁▁▁▁▁▁▁▁▁█████████▁▁","▁▁▁▁▁▁▁▁▁▁█████████▁","▁▁▁▁▁▁▁▁▁▁▁████████▁","▁▁▁▁▁▁▁▁▁▁▁████████▁","▁▁▁▁▁▁▁▁▁▁▁▁███████▁","▁▁▁▁▁▁▁▁▁▁▁▁███████▁","▁▁▁▁▁▁▁▁▁▁▁▁▁███████","▁▁▁▁▁▁▁▁▁▁▁▁▁███████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁","▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁"]},"moon":{"interval":80,"frames":["🌑 ","🌒 ","🌓 ","🌔 ","🌕 ","🌖 ","🌗 ","🌘 "]},"runner":{"interval":140,"frames":["🚶 ","🏃 "]},"pong":{"interval":80,"frames":["▐⠂       ▌","▐⠈       ▌","▐ ⠂      ▌","▐ ⠠      ▌","▐  ⡀     ▌","▐  ⠠     ▌","▐   ⠂    ▌","▐   ⠈    ▌","▐    ⠂   ▌","▐    ⠠   ▌","▐     ⡀  ▌","▐     ⠠  ▌","▐      ⠂ ▌","▐      ⠈ ▌","▐       ⠂▌","▐       ⠠▌","▐       ⡀▌","▐      ⠠ ▌","▐      ⠂ ▌","▐     ⠈  ▌","▐     ⠂  ▌","▐    ⠠   ▌","▐    ⡀   ▌","▐   ⠠    ▌","▐   ⠂    ▌","▐  ⠈     ▌","▐  ⠂     ▌","▐ ⠠      ▌","▐ ⡀      ▌","▐⠠       ▌"]},"shark":{"interval":120,"frames":["▐|\\\\____________▌","▐_|\\\\___________▌","▐__|\\\\__________▌","▐___|\\\\_________▌","▐____|\\\\________▌","▐_____|\\\\_______▌","▐______|\\\\______▌","▐_______|\\\\_____▌","▐________|\\\\____▌","▐_________|\\\\___▌","▐__________|\\\\__▌","▐___________|\\\\_▌","▐____________|\\\\▌","▐____________/|▌","▐___________/|_▌","▐__________/|__▌","▐_________/|___▌","▐________/|____▌","▐_______/|_____▌","▐______/|______▌","▐_____/|_______▌","▐____/|________▌","▐___/|_________▌","▐__/|__________▌","▐_/|___________▌","▐/|____________▌"]},"dqpb":{"interval":100,"frames":["d","q","p","b"]},"weather":{"interval":100,"frames":["☀️ ","☀️ ","☀️ ","🌤 ","⛅️ ","🌥 ","☁️ ","🌧 ","🌨 ","🌧 ","🌨 ","🌧 ","🌨 ","⛈ ","🌨 ","🌧 ","🌨 ","☁️ ","🌥 ","⛅️ ","🌤 ","☀️ ","☀️ "]},"christmas":{"interval":400,"frames":["🌲","🎄"]},"grenade":{"interval":80,"frames":["،  ","′  "," ´ "," ‾ ","  ⸌","  ⸊","  |","  ⁎","  ⁕"," ෴ ","  ⁓","   ","   ","   "]},"point":{"interval":125,"frames":["∙∙∙","●∙∙","∙●∙","∙∙●","∙∙∙"]},"layer":{"interval":150,"frames":["-","=","≡"]},"betaWave":{"interval":80,"frames":["ρββββββ","βρβββββ","ββρββββ","βββρβββ","ββββρββ","βββββρβ","ββββββρ"]},"fingerDance":{"interval":160,"frames":["🤘 ","🤟 ","🖖 ","✋ ","🤚 ","👆 "]},"fistBump":{"interval":80,"frames":["🤜　　　　🤛 ","🤜　　　　🤛 ","🤜　　　　🤛 ","　🤜　　🤛　 ","　　🤜🤛　　 ","　🤜✨🤛　　 ","🤜　✨　🤛　 "]},"soccerHeader":{"interval":80,"frames":[" 🧑⚽️       🧑 ","🧑  ⚽️      🧑 ","🧑   ⚽️     🧑 ","🧑    ⚽️    🧑 ","🧑     ⚽️   🧑 ","🧑      ⚽️  🧑 ","🧑       ⚽️🧑  ","🧑      ⚽️  🧑 ","🧑     ⚽️   🧑 ","🧑    ⚽️    🧑 ","🧑   ⚽️     🧑 ","🧑  ⚽️      🧑 "]},"mindblown":{"interval":160,"frames":["😐 ","😐 ","😮 ","😮 ","😦 ","😦 ","😧 ","😧 ","🤯 ","💥 ","✨ ","　 ","　 ","　 "]},"speaker":{"interval":160,"frames":["🔈 ","🔉 ","🔊 ","🔉 "]},"orangePulse":{"interval":100,"frames":["🔸 ","🔶 ","🟠 ","🟠 ","🔶 "]},"bluePulse":{"interval":100,"frames":["🔹 ","🔷 ","🔵 ","🔵 ","🔷 "]},"orangeBluePulse":{"interval":100,"frames":["🔸 ","🔶 ","🟠 ","🟠 ","🔶 ","🔹 ","🔷 ","🔵 ","🔵 ","🔷 "]},"timeTravel":{"interval":100,"frames":["🕛 ","🕚 ","🕙 ","🕘 ","🕗 ","🕖 ","🕕 ","🕔 ","🕓 ","🕒 ","🕑 ","🕐 "]},"aesthetic":{"interval":80,"frames":["▰▱▱▱▱▱▱","▰▰▱▱▱▱▱","▰▰▰▱▱▱▱","▰▰▰▰▱▱▱","▰▰▰▰▰▱▱","▰▰▰▰▰▰▱","▰▰▰▰▰▰▰","▰▱▱▱▱▱▱"]},"dwarfFortress":{"interval":80,"frames":[" ██████£££  ","☺██████£££  ","☺██████£££  ","☺▓█████£££  ","☺▓█████£££  ","☺▒█████£££  ","☺▒█████£££  ","☺░█████£££  ","☺░█████£££  ","☺ █████£££  "," ☺█████£££  "," ☺█████£££  "," ☺▓████£££  "," ☺▓████£££  "," ☺▒████£££  "," ☺▒████£££  "," ☺░████£££  "," ☺░████£££  "," ☺ ████£££  ","  ☺████£££  ","  ☺████£££  ","  ☺▓███£££  ","  ☺▓███£££  ","  ☺▒███£££  ","  ☺▒███£££  ","  ☺░███£££  ","  ☺░███£££  ","  ☺ ███£££  ","   ☺███£££  ","   ☺███£££  ","   ☺▓██£££  ","   ☺▓██£££  ","   ☺▒██£££  ","   ☺▒██£££  ","   ☺░██£££  ","   ☺░██£££  ","   ☺ ██£££  ","    ☺██£££  ","    ☺██£££  ","    ☺▓█£££  ","    ☺▓█£££  ","    ☺▒█£££  ","    ☺▒█£££  ","    ☺░█£££  ","    ☺░█£££  ","    ☺ █£££  ","     ☺█£££  ","     ☺█£££  ","     ☺▓£££  ","     ☺▓£££  ","     ☺▒£££  ","     ☺▒£££  ","     ☺░£££  ","     ☺░£££  ","     ☺ £££  ","      ☺£££  ","      ☺£££  ","      ☺▓££  ","      ☺▓££  ","      ☺▒££  ","      ☺▒££  ","      ☺░££  ","      ☺░££  ","      ☺ ££  ","       ☺££  ","       ☺££  ","       ☺▓£  ","       ☺▓£  ","       ☺▒£  ","       ☺▒£  ","       ☺░£  ","       ☺░£  ","       ☺ £  ","        ☺£  ","        ☺£  ","        ☺▓  ","        ☺▓  ","        ☺▒  ","        ☺▒  ","        ☺░  ","        ☺░  ","        ☺   ","        ☺  &","        ☺ ☼&","       ☺ ☼ &","       ☺☼  &","      ☺☼  & ","      ‼   & ","     ☺   &  ","    ‼    &  ","   ☺    &   ","  ‼     &   "," ☺     &    ","‼      &    ","      &     ","      &     ","     &   ░  ","     &   ▒  ","    &    ▓  ","    &    £  ","   &    ░£  ","   &    ▒£  ","  &     ▓£  ","  &     ££  "," &     ░££  "," &     ▒££  ","&      ▓££  ","&      £££  ","      ░£££  ","      ▒£££  ","      ▓£££  ","      █£££  ","     ░█£££  ","     ▒█£££  ","     ▓█£££  ","     ██£££  ","    ░██£££  ","    ▒██£££  ","    ▓██£££  ","    ███£££  ","   ░███£££  ","   ▒███£££  ","   ▓███£££  ","   ████£££  ","  ░████£££  ","  ▒████£££  ","  ▓████£££  ","  █████£££  "," ░█████£££  "," ▒█████£££  "," ▓█████£££  "," ██████£££  "," ██████£££  "]}}');

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__nccwpck_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__nccwpck_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__nccwpck_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  "B": () => (/* binding */ installBinary)
});

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __nccwpck_require__(2186);
;// CONCATENATED MODULE: ./node_modules/chalk/source/vendor/ansi-styles/index.js
const ANSI_BACKGROUND_OFFSET = 10;

const wrapAnsi16 = (offset = 0) => code => `\u001B[${code + offset}m`;

const wrapAnsi256 = (offset = 0) => code => `\u001B[${38 + offset};5;${code}m`;

const wrapAnsi16m = (offset = 0) => (red, green, blue) => `\u001B[${38 + offset};2;${red};${green};${blue}m`;

const styles = {
	modifier: {
		reset: [0, 0],
		// 21 isn't widely supported and 22 does the same thing
		bold: [1, 22],
		dim: [2, 22],
		italic: [3, 23],
		underline: [4, 24],
		overline: [53, 55],
		inverse: [7, 27],
		hidden: [8, 28],
		strikethrough: [9, 29],
	},
	color: {
		black: [30, 39],
		red: [31, 39],
		green: [32, 39],
		yellow: [33, 39],
		blue: [34, 39],
		magenta: [35, 39],
		cyan: [36, 39],
		white: [37, 39],

		// Bright color
		blackBright: [90, 39],
		gray: [90, 39], // Alias of `blackBright`
		grey: [90, 39], // Alias of `blackBright`
		redBright: [91, 39],
		greenBright: [92, 39],
		yellowBright: [93, 39],
		blueBright: [94, 39],
		magentaBright: [95, 39],
		cyanBright: [96, 39],
		whiteBright: [97, 39],
	},
	bgColor: {
		bgBlack: [40, 49],
		bgRed: [41, 49],
		bgGreen: [42, 49],
		bgYellow: [43, 49],
		bgBlue: [44, 49],
		bgMagenta: [45, 49],
		bgCyan: [46, 49],
		bgWhite: [47, 49],

		// Bright color
		bgBlackBright: [100, 49],
		bgGray: [100, 49], // Alias of `bgBlackBright`
		bgGrey: [100, 49], // Alias of `bgBlackBright`
		bgRedBright: [101, 49],
		bgGreenBright: [102, 49],
		bgYellowBright: [103, 49],
		bgBlueBright: [104, 49],
		bgMagentaBright: [105, 49],
		bgCyanBright: [106, 49],
		bgWhiteBright: [107, 49],
	},
};

const modifierNames = Object.keys(styles.modifier);
const foregroundColorNames = Object.keys(styles.color);
const backgroundColorNames = Object.keys(styles.bgColor);
const colorNames = [...foregroundColorNames, ...backgroundColorNames];

function assembleStyles() {
	const codes = new Map();

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`,
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false,
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false,
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	styles.color.ansi = wrapAnsi16();
	styles.color.ansi256 = wrapAnsi256();
	styles.color.ansi16m = wrapAnsi16m();
	styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
	styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
	styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);

	// From https://github.com/Qix-/color-convert/blob/3f0e0d4e92e235796ccb17f6e85c72094a651f49/conversions.js
	Object.defineProperties(styles, {
		rgbToAnsi256: {
			value(red, green, blue) {
				// We use the extended greyscale palette here, with the exception of
				// black and white. normal palette only has 4 greyscale shades.
				if (red === green && green === blue) {
					if (red < 8) {
						return 16;
					}

					if (red > 248) {
						return 231;
					}

					return Math.round(((red - 8) / 247) * 24) + 232;
				}

				return 16
					+ (36 * Math.round(red / 255 * 5))
					+ (6 * Math.round(green / 255 * 5))
					+ Math.round(blue / 255 * 5);
			},
			enumerable: false,
		},
		hexToRgb: {
			value(hex) {
				const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
				if (!matches) {
					return [0, 0, 0];
				}

				let [colorString] = matches;

				if (colorString.length === 3) {
					colorString = [...colorString].map(character => character + character).join('');
				}

				const integer = Number.parseInt(colorString, 16);

				return [
					/* eslint-disable no-bitwise */
					(integer >> 16) & 0xFF,
					(integer >> 8) & 0xFF,
					integer & 0xFF,
					/* eslint-enable no-bitwise */
				];
			},
			enumerable: false,
		},
		hexToAnsi256: {
			value: hex => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
			enumerable: false,
		},
		ansi256ToAnsi: {
			value(code) {
				if (code < 8) {
					return 30 + code;
				}

				if (code < 16) {
					return 90 + (code - 8);
				}

				let red;
				let green;
				let blue;

				if (code >= 232) {
					red = (((code - 232) * 10) + 8) / 255;
					green = red;
					blue = red;
				} else {
					code -= 16;

					const remainder = code % 36;

					red = Math.floor(code / 36) / 5;
					green = Math.floor(remainder / 6) / 5;
					blue = (remainder % 6) / 5;
				}

				const value = Math.max(red, green, blue) * 2;

				if (value === 0) {
					return 30;
				}

				// eslint-disable-next-line no-bitwise
				let result = 30 + ((Math.round(blue) << 2) | (Math.round(green) << 1) | Math.round(red));

				if (value === 2) {
					result += 60;
				}

				return result;
			},
			enumerable: false,
		},
		rgbToAnsi: {
			value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
			enumerable: false,
		},
		hexToAnsi: {
			value: hex => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
			enumerable: false,
		},
	});

	return styles;
}

const ansiStyles = assembleStyles();

/* harmony default export */ const ansi_styles = (ansiStyles);

;// CONCATENATED MODULE: external "node:process"
const external_node_process_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:process");
;// CONCATENATED MODULE: external "node:os"
const external_node_os_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:os");
;// CONCATENATED MODULE: external "node:tty"
const external_node_tty_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:tty");
;// CONCATENATED MODULE: ./node_modules/chalk/source/vendor/supports-color/index.js




// From: https://github.com/sindresorhus/has-flag/blob/main/index.js
/// function hasFlag(flag, argv = globalThis.Deno?.args ?? process.argv) {
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : external_node_process_namespaceObject.argv) {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}

const {env} = external_node_process_namespaceObject;

let flagForceColor;
if (
	hasFlag('no-color')
	|| hasFlag('no-colors')
	|| hasFlag('color=false')
	|| hasFlag('color=never')
) {
	flagForceColor = 0;
} else if (
	hasFlag('color')
	|| hasFlag('colors')
	|| hasFlag('color=true')
	|| hasFlag('color=always')
) {
	flagForceColor = 1;
}

function envForceColor() {
	if ('FORCE_COLOR' in env) {
		if (env.FORCE_COLOR === 'true') {
			return 1;
		}

		if (env.FORCE_COLOR === 'false') {
			return 0;
		}

		return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3,
	};
}

function _supportsColor(haveStream, {streamIsTTY, sniffFlags = true} = {}) {
	const noFlagForceColor = envForceColor();
	if (noFlagForceColor !== undefined) {
		flagForceColor = noFlagForceColor;
	}

	const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;

	if (forceColor === 0) {
		return 0;
	}

	if (sniffFlags) {
		if (hasFlag('color=16m')
			|| hasFlag('color=full')
			|| hasFlag('color=truecolor')) {
			return 3;
		}

		if (hasFlag('color=256')) {
			return 2;
		}
	}

	// Check for Azure DevOps pipelines.
	// Has to be above the `!streamIsTTY` check.
	if ('TF_BUILD' in env && 'AGENT_NAME' in env) {
		return 1;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (external_node_process_namespaceObject.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = external_node_os_namespaceObject.release().split('.');
		if (
			Number(osRelease[0]) >= 10
			&& Number(osRelease[2]) >= 10_586
		) {
			return Number(osRelease[2]) >= 14_931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if ('GITHUB_ACTIONS' in env || 'GITEA_ACTIONS' in env) {
			return 3;
		}

		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'BUILDKITE', 'DRONE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if (env.TERM === 'xterm-kitty') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = Number.parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app': {
				return version >= 3 ? 3 : 2;
			}

			case 'Apple_Terminal': {
				return 2;
			}
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function createSupportsColor(stream, options = {}) {
	const level = _supportsColor(stream, {
		streamIsTTY: stream && stream.isTTY,
		...options,
	});

	return translateLevel(level);
}

const supportsColor = {
	stdout: createSupportsColor({isTTY: external_node_tty_namespaceObject.isatty(1)}),
	stderr: createSupportsColor({isTTY: external_node_tty_namespaceObject.isatty(2)}),
};

/* harmony default export */ const supports_color = (supportsColor);

;// CONCATENATED MODULE: ./node_modules/chalk/source/utilities.js
// TODO: When targeting Node.js 16, use `String.prototype.replaceAll`.
function stringReplaceAll(string, substring, replacer) {
	let index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const substringLength = substring.length;
	let endIndex = 0;
	let returnValue = '';
	do {
		returnValue += string.slice(endIndex, index) + substring + replacer;
		endIndex = index + substringLength;
		index = string.indexOf(substring, endIndex);
	} while (index !== -1);

	returnValue += string.slice(endIndex);
	return returnValue;
}

function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
	let endIndex = 0;
	let returnValue = '';
	do {
		const gotCR = string[index - 1] === '\r';
		returnValue += string.slice(endIndex, (gotCR ? index - 1 : index)) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
		endIndex = index + 1;
		index = string.indexOf('\n', endIndex);
	} while (index !== -1);

	returnValue += string.slice(endIndex);
	return returnValue;
}

;// CONCATENATED MODULE: ./node_modules/chalk/source/index.js




const {stdout: stdoutColor, stderr: stderrColor} = supports_color;

const GENERATOR = Symbol('GENERATOR');
const STYLER = Symbol('STYLER');
const IS_EMPTY = Symbol('IS_EMPTY');

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = [
	'ansi',
	'ansi',
	'ansi256',
	'ansi16m',
];

const source_styles = Object.create(null);

const applyOptions = (object, options = {}) => {
	if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
		throw new Error('The `level` option should be an integer from 0 to 3');
	}

	// Detect level if not set manually
	const colorLevel = stdoutColor ? stdoutColor.level : 0;
	object.level = options.level === undefined ? colorLevel : options.level;
};

class Chalk {
	constructor(options) {
		// eslint-disable-next-line no-constructor-return
		return chalkFactory(options);
	}
}

const chalkFactory = options => {
	const chalk = (...strings) => strings.join(' ');
	applyOptions(chalk, options);

	Object.setPrototypeOf(chalk, createChalk.prototype);

	return chalk;
};

function createChalk(options) {
	return chalkFactory(options);
}

Object.setPrototypeOf(createChalk.prototype, Function.prototype);

for (const [styleName, style] of Object.entries(ansi_styles)) {
	source_styles[styleName] = {
		get() {
			const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
			Object.defineProperty(this, styleName, {value: builder});
			return builder;
		},
	};
}

source_styles.visible = {
	get() {
		const builder = createBuilder(this, this[STYLER], true);
		Object.defineProperty(this, 'visible', {value: builder});
		return builder;
	},
};

const getModelAnsi = (model, level, type, ...arguments_) => {
	if (model === 'rgb') {
		if (level === 'ansi16m') {
			return ansi_styles[type].ansi16m(...arguments_);
		}

		if (level === 'ansi256') {
			return ansi_styles[type].ansi256(ansi_styles.rgbToAnsi256(...arguments_));
		}

		return ansi_styles[type].ansi(ansi_styles.rgbToAnsi(...arguments_));
	}

	if (model === 'hex') {
		return getModelAnsi('rgb', level, type, ...ansi_styles.hexToRgb(...arguments_));
	}

	return ansi_styles[type][model](...arguments_);
};

const usedModels = ['rgb', 'hex', 'ansi256'];

for (const model of usedModels) {
	source_styles[model] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(getModelAnsi(model, levelMapping[level], 'color', ...arguments_), ansi_styles.color.close, this[STYLER]);
				return createBuilder(this, styler, this[IS_EMPTY]);
			};
		},
	};

	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	source_styles[bgModel] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(getModelAnsi(model, levelMapping[level], 'bgColor', ...arguments_), ansi_styles.bgColor.close, this[STYLER]);
				return createBuilder(this, styler, this[IS_EMPTY]);
			};
		},
	};
}

const proto = Object.defineProperties(() => {}, {
	...source_styles,
	level: {
		enumerable: true,
		get() {
			return this[GENERATOR].level;
		},
		set(level) {
			this[GENERATOR].level = level;
		},
	},
});

const createStyler = (open, close, parent) => {
	let openAll;
	let closeAll;
	if (parent === undefined) {
		openAll = open;
		closeAll = close;
	} else {
		openAll = parent.openAll + open;
		closeAll = close + parent.closeAll;
	}

	return {
		open,
		close,
		openAll,
		closeAll,
		parent,
	};
};

const createBuilder = (self, _styler, _isEmpty) => {
	// Single argument is hot path, implicit coercion is faster than anything
	// eslint-disable-next-line no-implicit-coercion
	const builder = (...arguments_) => applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));

	// We alter the prototype because we must return a function, but there is
	// no way to create a function with a different prototype
	Object.setPrototypeOf(builder, proto);

	builder[GENERATOR] = self;
	builder[STYLER] = _styler;
	builder[IS_EMPTY] = _isEmpty;

	return builder;
};

const applyStyle = (self, string) => {
	if (self.level <= 0 || !string) {
		return self[IS_EMPTY] ? '' : string;
	}

	let styler = self[STYLER];

	if (styler === undefined) {
		return string;
	}

	const {openAll, closeAll} = styler;
	if (string.includes('\u001B')) {
		while (styler !== undefined) {
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			string = stringReplaceAll(string, styler.close, styler.open);

			styler = styler.parent;
		}
	}

	// We can move both next actions out of loop, because remaining actions in loop won't have
	// any/visible effect on parts we add here. Close the styling before a linebreak and reopen
	// after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
	const lfIndex = string.indexOf('\n');
	if (lfIndex !== -1) {
		string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
	}

	return openAll + string + closeAll;
};

Object.defineProperties(createChalk.prototype, source_styles);

const chalk = createChalk();
const chalkStderr = createChalk({level: stderrColor ? stderrColor.level : 0});





/* harmony default export */ const source = (chalk);

// EXTERNAL MODULE: external "os"
var external_os_ = __nccwpck_require__(2037);
;// CONCATENATED MODULE: external "node:buffer"
const external_node_buffer_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:buffer");
;// CONCATENATED MODULE: external "node:path"
const external_node_path_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:path");
;// CONCATENATED MODULE: external "node:child_process"
const external_node_child_process_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:child_process");
// EXTERNAL MODULE: ./node_modules/cross-spawn/index.js
var cross_spawn = __nccwpck_require__(7881);
;// CONCATENATED MODULE: ./node_modules/strip-final-newline/index.js
function stripFinalNewline(input) {
	const LF = typeof input === 'string' ? '\n' : '\n'.charCodeAt();
	const CR = typeof input === 'string' ? '\r' : '\r'.charCodeAt();

	if (input[input.length - 1] === LF) {
		input = input.slice(0, -1);
	}

	if (input[input.length - 1] === CR) {
		input = input.slice(0, -1);
	}

	return input;
}

;// CONCATENATED MODULE: external "node:url"
const external_node_url_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:url");
;// CONCATENATED MODULE: ./node_modules/npm-run-path/node_modules/path-key/index.js
function pathKey(options = {}) {
	const {
		env = process.env,
		platform = process.platform
	} = options;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(env).reverse().find(key => key.toUpperCase() === 'PATH') || 'Path';
}

;// CONCATENATED MODULE: ./node_modules/npm-run-path/index.js





function npmRunPath(options = {}) {
	const {
		cwd = external_node_process_namespaceObject.cwd(),
		path: path_ = external_node_process_namespaceObject.env[pathKey()],
		execPath = external_node_process_namespaceObject.execPath,
	} = options;

	let previous;
	const cwdString = cwd instanceof URL ? external_node_url_namespaceObject.fileURLToPath(cwd) : cwd;
	let cwdPath = external_node_path_namespaceObject.resolve(cwdString);
	const result = [];

	while (previous !== cwdPath) {
		result.push(external_node_path_namespaceObject.join(cwdPath, 'node_modules/.bin'));
		previous = cwdPath;
		cwdPath = external_node_path_namespaceObject.resolve(cwdPath, '..');
	}

	// Ensure the running `node` binary is used.
	result.push(external_node_path_namespaceObject.resolve(cwdString, execPath, '..'));

	return [...result, path_].join(external_node_path_namespaceObject.delimiter);
}

function npmRunPathEnv({env = external_node_process_namespaceObject.env, ...options} = {}) {
	env = {...env};

	const path = pathKey({env});
	options.path = env[path];
	env[path] = npmRunPath(options);

	return env;
}

;// CONCATENATED MODULE: ./node_modules/mimic-fn/index.js
const copyProperty = (to, from, property, ignoreNonConfigurable) => {
	// `Function#length` should reflect the parameters of `to` not `from` since we keep its body.
	// `Function#prototype` is non-writable and non-configurable so can never be modified.
	if (property === 'length' || property === 'prototype') {
		return;
	}

	// `Function#arguments` and `Function#caller` should not be copied. They were reported to be present in `Reflect.ownKeys` for some devices in React Native (#41), so we explicitly ignore them here.
	if (property === 'arguments' || property === 'caller') {
		return;
	}

	const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
	const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);

	if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
		return;
	}

	Object.defineProperty(to, property, fromDescriptor);
};

// `Object.defineProperty()` throws if the property exists, is not configurable and either:
// - one its descriptors is changed
// - it is non-writable and its value is changed
const canCopyProperty = function (toDescriptor, fromDescriptor) {
	return toDescriptor === undefined || toDescriptor.configurable || (
		toDescriptor.writable === fromDescriptor.writable &&
		toDescriptor.enumerable === fromDescriptor.enumerable &&
		toDescriptor.configurable === fromDescriptor.configurable &&
		(toDescriptor.writable || toDescriptor.value === fromDescriptor.value)
	);
};

const changePrototype = (to, from) => {
	const fromPrototype = Object.getPrototypeOf(from);
	if (fromPrototype === Object.getPrototypeOf(to)) {
		return;
	}

	Object.setPrototypeOf(to, fromPrototype);
};

const wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/\n${fromBody}`;

const toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, 'toString');
const toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, 'name');

// We call `from.toString()` early (not lazily) to ensure `from` can be garbage collected.
// We use `bind()` instead of a closure for the same reason.
// Calling `from.toString()` early also allows caching it in case `to.toString()` is called several times.
const changeToString = (to, from, name) => {
	const withName = name === '' ? '' : `with ${name.trim()}() `;
	const newToString = wrappedToString.bind(null, withName, from.toString());
	// Ensure `to.toString.toString` is non-enumerable and has the same `same`
	Object.defineProperty(newToString, 'name', toStringName);
	Object.defineProperty(to, 'toString', {...toStringDescriptor, value: newToString});
};

function mimicFunction(to, from, {ignoreNonConfigurable = false} = {}) {
	const {name} = to;

	for (const property of Reflect.ownKeys(from)) {
		copyProperty(to, from, property, ignoreNonConfigurable);
	}

	changePrototype(to, from);
	changeToString(to, from, name);

	return to;
}

;// CONCATENATED MODULE: ./node_modules/onetime/index.js


const calledFunctions = new WeakMap();

const onetime = (function_, options = {}) => {
	if (typeof function_ !== 'function') {
		throw new TypeError('Expected a function');
	}

	let returnValue;
	let callCount = 0;
	const functionName = function_.displayName || function_.name || '<anonymous>';

	const onetime = function (...arguments_) {
		calledFunctions.set(onetime, ++callCount);

		if (callCount === 1) {
			returnValue = function_.apply(this, arguments_);
			function_ = null;
		} else if (options.throw === true) {
			throw new Error(`Function \`${functionName}\` can only be called once`);
		}

		return returnValue;
	};

	mimicFunction(onetime, function_);
	calledFunctions.set(onetime, callCount);

	return onetime;
};

onetime.callCount = function_ => {
	if (!calledFunctions.has(function_)) {
		throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
	}

	return calledFunctions.get(function_);
};

/* harmony default export */ const node_modules_onetime = (onetime);

;// CONCATENATED MODULE: ./node_modules/human-signals/build/src/realtime.js

const getRealtimeSignals=()=>{
const length=SIGRTMAX-SIGRTMIN+1;
return Array.from({length},getRealtimeSignal)
};

const getRealtimeSignal=(value,index)=>({
name:`SIGRT${index+1}`,
number:SIGRTMIN+index,
action:"terminate",
description:"Application-specific signal (realtime)",
standard:"posix"
});

const SIGRTMIN=34;
const SIGRTMAX=64;
;// CONCATENATED MODULE: ./node_modules/human-signals/build/src/core.js


const SIGNALS=[
{
name:"SIGHUP",
number:1,
action:"terminate",
description:"Terminal closed",
standard:"posix"
},
{
name:"SIGINT",
number:2,
action:"terminate",
description:"User interruption with CTRL-C",
standard:"ansi"
},
{
name:"SIGQUIT",
number:3,
action:"core",
description:"User interruption with CTRL-\\",
standard:"posix"
},
{
name:"SIGILL",
number:4,
action:"core",
description:"Invalid machine instruction",
standard:"ansi"
},
{
name:"SIGTRAP",
number:5,
action:"core",
description:"Debugger breakpoint",
standard:"posix"
},
{
name:"SIGABRT",
number:6,
action:"core",
description:"Aborted",
standard:"ansi"
},
{
name:"SIGIOT",
number:6,
action:"core",
description:"Aborted",
standard:"bsd"
},
{
name:"SIGBUS",
number:7,
action:"core",
description:
"Bus error due to misaligned, non-existing address or paging error",
standard:"bsd"
},
{
name:"SIGEMT",
number:7,
action:"terminate",
description:"Command should be emulated but is not implemented",
standard:"other"
},
{
name:"SIGFPE",
number:8,
action:"core",
description:"Floating point arithmetic error",
standard:"ansi"
},
{
name:"SIGKILL",
number:9,
action:"terminate",
description:"Forced termination",
standard:"posix",
forced:true
},
{
name:"SIGUSR1",
number:10,
action:"terminate",
description:"Application-specific signal",
standard:"posix"
},
{
name:"SIGSEGV",
number:11,
action:"core",
description:"Segmentation fault",
standard:"ansi"
},
{
name:"SIGUSR2",
number:12,
action:"terminate",
description:"Application-specific signal",
standard:"posix"
},
{
name:"SIGPIPE",
number:13,
action:"terminate",
description:"Broken pipe or socket",
standard:"posix"
},
{
name:"SIGALRM",
number:14,
action:"terminate",
description:"Timeout or timer",
standard:"posix"
},
{
name:"SIGTERM",
number:15,
action:"terminate",
description:"Termination",
standard:"ansi"
},
{
name:"SIGSTKFLT",
number:16,
action:"terminate",
description:"Stack is empty or overflowed",
standard:"other"
},
{
name:"SIGCHLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"posix"
},
{
name:"SIGCLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"other"
},
{
name:"SIGCONT",
number:18,
action:"unpause",
description:"Unpaused",
standard:"posix",
forced:true
},
{
name:"SIGSTOP",
number:19,
action:"pause",
description:"Paused",
standard:"posix",
forced:true
},
{
name:"SIGTSTP",
number:20,
action:"pause",
description:"Paused using CTRL-Z or \"suspend\"",
standard:"posix"
},
{
name:"SIGTTIN",
number:21,
action:"pause",
description:"Background process cannot read terminal input",
standard:"posix"
},
{
name:"SIGBREAK",
number:21,
action:"terminate",
description:"User interruption with CTRL-BREAK",
standard:"other"
},
{
name:"SIGTTOU",
number:22,
action:"pause",
description:"Background process cannot write to terminal output",
standard:"posix"
},
{
name:"SIGURG",
number:23,
action:"ignore",
description:"Socket received out-of-band data",
standard:"bsd"
},
{
name:"SIGXCPU",
number:24,
action:"core",
description:"Process timed out",
standard:"bsd"
},
{
name:"SIGXFSZ",
number:25,
action:"core",
description:"File too big",
standard:"bsd"
},
{
name:"SIGVTALRM",
number:26,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"
},
{
name:"SIGPROF",
number:27,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"
},
{
name:"SIGWINCH",
number:28,
action:"ignore",
description:"Terminal window size changed",
standard:"bsd"
},
{
name:"SIGIO",
number:29,
action:"terminate",
description:"I/O is available",
standard:"other"
},
{
name:"SIGPOLL",
number:29,
action:"terminate",
description:"Watched event",
standard:"other"
},
{
name:"SIGINFO",
number:29,
action:"ignore",
description:"Request for process information",
standard:"other"
},
{
name:"SIGPWR",
number:30,
action:"terminate",
description:"Device running out of power",
standard:"systemv"
},
{
name:"SIGSYS",
number:31,
action:"core",
description:"Invalid system call",
standard:"other"
},
{
name:"SIGUNUSED",
number:31,
action:"terminate",
description:"Invalid system call",
standard:"other"
}];
;// CONCATENATED MODULE: ./node_modules/human-signals/build/src/signals.js







const getSignals=()=>{
const realtimeSignals=getRealtimeSignals();
const signals=[...SIGNALS,...realtimeSignals].map(normalizeSignal);
return signals
};







const normalizeSignal=({
name,
number:defaultNumber,
description,
action,
forced=false,
standard
})=>{
const{
signals:{[name]:constantSignal}
}=external_node_os_namespaceObject.constants;
const supported=constantSignal!==undefined;
const number=supported?constantSignal:defaultNumber;
return{name,number,description,supported,action,forced,standard}
};
;// CONCATENATED MODULE: ./node_modules/human-signals/build/src/main.js







const getSignalsByName=()=>{
const signals=getSignals();
return Object.fromEntries(signals.map(getSignalByName))
};

const getSignalByName=({
name,
number,
description,
supported,
action,
forced,
standard
})=>[name,{name,number,description,supported,action,forced,standard}];

const signalsByName=getSignalsByName();




const getSignalsByNumber=()=>{
const signals=getSignals();
const length=SIGRTMAX+1;
const signalsA=Array.from({length},(value,number)=>
getSignalByNumber(number,signals)
);
return Object.assign({},...signalsA)
};

const getSignalByNumber=(number,signals)=>{
const signal=findSignalByNumber(number,signals);

if(signal===undefined){
return{}
}

const{name,description,supported,action,forced,standard}=signal;
return{
[number]:{
name,
number,
description,
supported,
action,
forced,
standard
}
}
};



const findSignalByNumber=(number,signals)=>{
const signal=signals.find(({name})=>external_node_os_namespaceObject.constants.signals[name]===number);

if(signal!==undefined){
return signal
}

return signals.find((signalA)=>signalA.number===number)
};

const signalsByNumber=getSignalsByNumber();
;// CONCATENATED MODULE: ./node_modules/execa/lib/error.js



const getErrorPrefix = ({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled}) => {
	if (timedOut) {
		return `timed out after ${timeout} milliseconds`;
	}

	if (isCanceled) {
		return 'was canceled';
	}

	if (errorCode !== undefined) {
		return `failed with ${errorCode}`;
	}

	if (signal !== undefined) {
		return `was killed with ${signal} (${signalDescription})`;
	}

	if (exitCode !== undefined) {
		return `failed with exit code ${exitCode}`;
	}

	return 'failed';
};

const makeError = ({
	stdout,
	stderr,
	all,
	error,
	signal,
	exitCode,
	command,
	escapedCommand,
	timedOut,
	isCanceled,
	killed,
	parsed: {options: {timeout, cwd = external_node_process_namespaceObject.cwd()}},
}) => {
	// `signal` and `exitCode` emitted on `spawned.on('exit')` event can be `null`.
	// We normalize them to `undefined`
	exitCode = exitCode === null ? undefined : exitCode;
	signal = signal === null ? undefined : signal;
	const signalDescription = signal === undefined ? undefined : signalsByName[signal].description;

	const errorCode = error && error.code;

	const prefix = getErrorPrefix({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled});
	const execaMessage = `Command ${prefix}: ${command}`;
	const isError = Object.prototype.toString.call(error) === '[object Error]';
	const shortMessage = isError ? `${execaMessage}\n${error.message}` : execaMessage;
	const message = [shortMessage, stderr, stdout].filter(Boolean).join('\n');

	if (isError) {
		error.originalMessage = error.message;
		error.message = message;
	} else {
		error = new Error(message);
	}

	error.shortMessage = shortMessage;
	error.command = command;
	error.escapedCommand = escapedCommand;
	error.exitCode = exitCode;
	error.signal = signal;
	error.signalDescription = signalDescription;
	error.stdout = stdout;
	error.stderr = stderr;
	error.cwd = cwd;

	if (all !== undefined) {
		error.all = all;
	}

	if ('bufferedData' in error) {
		delete error.bufferedData;
	}

	error.failed = true;
	error.timedOut = Boolean(timedOut);
	error.isCanceled = isCanceled;
	error.killed = killed && !timedOut;

	return error;
};

;// CONCATENATED MODULE: ./node_modules/execa/lib/stdio.js
const aliases = ['stdin', 'stdout', 'stderr'];

const hasAlias = options => aliases.some(alias => options[alias] !== undefined);

const normalizeStdio = options => {
	if (!options) {
		return;
	}

	const {stdio} = options;

	if (stdio === undefined) {
		return aliases.map(alias => options[alias]);
	}

	if (hasAlias(options)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map(alias => `\`${alias}\``).join(', ')}`);
	}

	if (typeof stdio === 'string') {
		return stdio;
	}

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const length = Math.max(stdio.length, aliases.length);
	return Array.from({length}, (value, index) => stdio[index]);
};

// `ipc` is pushed unless it is already present
const stdio_normalizeStdioNode = options => {
	const stdio = normalizeStdio(options);

	if (stdio === 'ipc') {
		return 'ipc';
	}

	if (stdio === undefined || typeof stdio === 'string') {
		return [stdio, stdio, stdio, 'ipc'];
	}

	if (stdio.includes('ipc')) {
		return stdio;
	}

	return [...stdio, 'ipc'];
};

;// CONCATENATED MODULE: ./node_modules/execa/node_modules/signal-exit/dist/mjs/signals.js
/**
 * This is not the set of all possible signals.
 *
 * It IS, however, the set of all signals that trigger
 * an exit on either Linux or BSD systems.  Linux is a
 * superset of the signal names supported on BSD, and
 * the unknown signals just fail to register, so we can
 * catch that easily enough.
 *
 * Windows signals are a different set, since there are
 * signals that terminate Windows processes, but don't
 * terminate (or don't even exist) on Posix systems.
 *
 * Don't bother with SIGKILL.  It's uncatchable, which
 * means that we can't fire any callbacks anyway.
 *
 * If a user does happen to register a handler on a non-
 * fatal signal like SIGWINCH or something, and then
 * exit, it'll end up firing `process.emit('exit')`, so
 * the handler will be fired anyway.
 *
 * SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
 * artificially, inherently leave the process in a
 * state from which it is not safe to try and enter JS
 * listeners.
 */
const signals = [];
signals.push('SIGHUP', 'SIGINT', 'SIGTERM');
if (process.platform !== 'win32') {
    signals.push('SIGALRM', 'SIGABRT', 'SIGVTALRM', 'SIGXCPU', 'SIGXFSZ', 'SIGUSR2', 'SIGTRAP', 'SIGSYS', 'SIGQUIT', 'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
    );
}
if (process.platform === 'linux') {
    signals.push('SIGIO', 'SIGPOLL', 'SIGPWR', 'SIGSTKFLT');
}
//# sourceMappingURL=signals.js.map
;// CONCATENATED MODULE: ./node_modules/execa/node_modules/signal-exit/dist/mjs/index.js
// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
// grab a reference to node's real process object right away


const processOk = (process) => !!process &&
    typeof process === 'object' &&
    typeof process.removeListener === 'function' &&
    typeof process.emit === 'function' &&
    typeof process.reallyExit === 'function' &&
    typeof process.listeners === 'function' &&
    typeof process.kill === 'function' &&
    typeof process.pid === 'number' &&
    typeof process.on === 'function';
const kExitEmitter = Symbol.for('signal-exit emitter');
const global = globalThis;
const ObjectDefineProperty = Object.defineProperty.bind(Object);
// teeny special purpose ee
class Emitter {
    emitted = {
        afterExit: false,
        exit: false,
    };
    listeners = {
        afterExit: [],
        exit: [],
    };
    count = 0;
    id = Math.random();
    constructor() {
        if (global[kExitEmitter]) {
            return global[kExitEmitter];
        }
        ObjectDefineProperty(global, kExitEmitter, {
            value: this,
            writable: false,
            enumerable: false,
            configurable: false,
        });
    }
    on(ev, fn) {
        this.listeners[ev].push(fn);
    }
    removeListener(ev, fn) {
        const list = this.listeners[ev];
        const i = list.indexOf(fn);
        /* c8 ignore start */
        if (i === -1) {
            return;
        }
        /* c8 ignore stop */
        if (i === 0 && list.length === 1) {
            list.length = 0;
        }
        else {
            list.splice(i, 1);
        }
    }
    emit(ev, code, signal) {
        if (this.emitted[ev]) {
            return false;
        }
        this.emitted[ev] = true;
        let ret = false;
        for (const fn of this.listeners[ev]) {
            ret = fn(code, signal) === true || ret;
        }
        if (ev === 'exit') {
            ret = this.emit('afterExit', code, signal) || ret;
        }
        return ret;
    }
}
class SignalExitBase {
}
const signalExitWrap = (handler) => {
    return {
        onExit(cb, opts) {
            return handler.onExit(cb, opts);
        },
        load() {
            return handler.load();
        },
        unload() {
            return handler.unload();
        },
    };
};
class SignalExitFallback extends SignalExitBase {
    onExit() {
        return () => { };
    }
    load() { }
    unload() { }
}
class SignalExit extends SignalExitBase {
    // "SIGHUP" throws an `ENOSYS` error on Windows,
    // so use a supported signal instead
    /* c8 ignore start */
    #hupSig = mjs_process.platform === 'win32' ? 'SIGINT' : 'SIGHUP';
    /* c8 ignore stop */
    #emitter = new Emitter();
    #process;
    #originalProcessEmit;
    #originalProcessReallyExit;
    #sigListeners = {};
    #loaded = false;
    constructor(process) {
        super();
        this.#process = process;
        // { <signal>: <listener fn>, ... }
        this.#sigListeners = {};
        for (const sig of signals) {
            this.#sigListeners[sig] = () => {
                // If there are no other listeners, an exit is coming!
                // Simplest way: remove us and then re-send the signal.
                // We know that this will kill the process, so we can
                // safely emit now.
                const listeners = this.#process.listeners(sig);
                let { count } = this.#emitter;
                // This is a workaround for the fact that signal-exit v3 and signal
                // exit v4 are not aware of each other, and each will attempt to let
                // the other handle it, so neither of them do. To correct this, we
                // detect if we're the only handler *except* for previous versions
                // of signal-exit, and increment by the count of listeners it has
                // created.
                /* c8 ignore start */
                const p = process;
                if (typeof p.__signal_exit_emitter__ === 'object' &&
                    typeof p.__signal_exit_emitter__.count === 'number') {
                    count += p.__signal_exit_emitter__.count;
                }
                /* c8 ignore stop */
                if (listeners.length === count) {
                    this.unload();
                    const ret = this.#emitter.emit('exit', null, sig);
                    /* c8 ignore start */
                    const s = sig === 'SIGHUP' ? this.#hupSig : sig;
                    if (!ret)
                        process.kill(process.pid, s);
                    /* c8 ignore stop */
                }
            };
        }
        this.#originalProcessReallyExit = process.reallyExit;
        this.#originalProcessEmit = process.emit;
    }
    onExit(cb, opts) {
        /* c8 ignore start */
        if (!processOk(this.#process)) {
            return () => { };
        }
        /* c8 ignore stop */
        if (this.#loaded === false) {
            this.load();
        }
        const ev = opts?.alwaysLast ? 'afterExit' : 'exit';
        this.#emitter.on(ev, cb);
        return () => {
            this.#emitter.removeListener(ev, cb);
            if (this.#emitter.listeners['exit'].length === 0 &&
                this.#emitter.listeners['afterExit'].length === 0) {
                this.unload();
            }
        };
    }
    load() {
        if (this.#loaded) {
            return;
        }
        this.#loaded = true;
        // This is the number of onSignalExit's that are in play.
        // It's important so that we can count the correct number of
        // listeners on signals, and don't wait for the other one to
        // handle it instead of us.
        this.#emitter.count += 1;
        for (const sig of signals) {
            try {
                const fn = this.#sigListeners[sig];
                if (fn)
                    this.#process.on(sig, fn);
            }
            catch (_) { }
        }
        this.#process.emit = (ev, ...a) => {
            return this.#processEmit(ev, ...a);
        };
        this.#process.reallyExit = (code) => {
            return this.#processReallyExit(code);
        };
    }
    unload() {
        if (!this.#loaded) {
            return;
        }
        this.#loaded = false;
        signals.forEach(sig => {
            const listener = this.#sigListeners[sig];
            /* c8 ignore start */
            if (!listener) {
                throw new Error('Listener not defined for signal: ' + sig);
            }
            /* c8 ignore stop */
            try {
                this.#process.removeListener(sig, listener);
                /* c8 ignore start */
            }
            catch (_) { }
            /* c8 ignore stop */
        });
        this.#process.emit = this.#originalProcessEmit;
        this.#process.reallyExit = this.#originalProcessReallyExit;
        this.#emitter.count -= 1;
    }
    #processReallyExit(code) {
        /* c8 ignore start */
        if (!processOk(this.#process)) {
            return 0;
        }
        this.#process.exitCode = code || 0;
        /* c8 ignore stop */
        this.#emitter.emit('exit', this.#process.exitCode, null);
        return this.#originalProcessReallyExit.call(this.#process, this.#process.exitCode);
    }
    #processEmit(ev, ...args) {
        const og = this.#originalProcessEmit;
        if (ev === 'exit' && processOk(this.#process)) {
            if (typeof args[0] === 'number') {
                this.#process.exitCode = args[0];
                /* c8 ignore start */
            }
            /* c8 ignore start */
            const ret = og.call(this.#process, ev, ...args);
            /* c8 ignore start */
            this.#emitter.emit('exit', this.#process.exitCode, null);
            /* c8 ignore stop */
            return ret;
        }
        else {
            return og.call(this.#process, ev, ...args);
        }
    }
}
const mjs_process = globalThis.process;
// wrap so that we call the method on the actual handler, without
// exporting it directly.
const { 
/**
 * Called when the process is exiting, whether via signal, explicit
 * exit, or running out of stuff to do.
 *
 * If the global process object is not suitable for instrumentation,
 * then this will be a no-op.
 *
 * Returns a function that may be used to unload signal-exit.
 */
onExit, 
/**
 * Load the listeners.  Likely you never need to call this, unless
 * doing a rather deep integration with signal-exit functionality.
 * Mostly exposed for the benefit of testing.
 *
 * @internal
 */
load, 
/**
 * Unload the listeners.  Likely you never need to call this, unless
 * doing a rather deep integration with signal-exit functionality.
 * Mostly exposed for the benefit of testing.
 *
 * @internal
 */
unload, } = signalExitWrap(processOk(mjs_process) ? new SignalExit(mjs_process) : new SignalExitFallback());
//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./node_modules/execa/lib/kill.js



const DEFAULT_FORCE_KILL_TIMEOUT = 1000 * 5;

// Monkey-patches `childProcess.kill()` to add `forceKillAfterTimeout` behavior
const spawnedKill = (kill, signal = 'SIGTERM', options = {}) => {
	const killResult = kill(signal);
	setKillTimeout(kill, signal, options, killResult);
	return killResult;
};

const setKillTimeout = (kill, signal, options, killResult) => {
	if (!shouldForceKill(signal, options, killResult)) {
		return;
	}

	const timeout = getForceKillAfterTimeout(options);
	const t = setTimeout(() => {
		kill('SIGKILL');
	}, timeout);

	// Guarded because there's no `.unref()` when `execa` is used in the renderer
	// process in Electron. This cannot be tested since we don't run tests in
	// Electron.
	// istanbul ignore else
	if (t.unref) {
		t.unref();
	}
};

const shouldForceKill = (signal, {forceKillAfterTimeout}, killResult) => isSigterm(signal) && forceKillAfterTimeout !== false && killResult;

const isSigterm = signal => signal === external_node_os_namespaceObject.constants.signals.SIGTERM
		|| (typeof signal === 'string' && signal.toUpperCase() === 'SIGTERM');

const getForceKillAfterTimeout = ({forceKillAfterTimeout = true}) => {
	if (forceKillAfterTimeout === true) {
		return DEFAULT_FORCE_KILL_TIMEOUT;
	}

	if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
		throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
	}

	return forceKillAfterTimeout;
};

// `childProcess.cancel()`
const spawnedCancel = (spawned, context) => {
	const killResult = spawned.kill();

	if (killResult) {
		context.isCanceled = true;
	}
};

const timeoutKill = (spawned, signal, reject) => {
	spawned.kill(signal);
	reject(Object.assign(new Error('Timed out'), {timedOut: true, signal}));
};

// `timeout` option handling
const setupTimeout = (spawned, {timeout, killSignal = 'SIGTERM'}, spawnedPromise) => {
	if (timeout === 0 || timeout === undefined) {
		return spawnedPromise;
	}

	let timeoutId;
	const timeoutPromise = new Promise((resolve, reject) => {
		timeoutId = setTimeout(() => {
			timeoutKill(spawned, killSignal, reject);
		}, timeout);
	});

	const safeSpawnedPromise = spawnedPromise.finally(() => {
		clearTimeout(timeoutId);
	});

	return Promise.race([timeoutPromise, safeSpawnedPromise]);
};

const validateTimeout = ({timeout}) => {
	if (timeout !== undefined && (!Number.isFinite(timeout) || timeout < 0)) {
		throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
	}
};

// `cleanup` option handling
const setExitHandler = async (spawned, {cleanup, detached}, timedPromise) => {
	if (!cleanup || detached) {
		return timedPromise;
	}

	const removeExitHandler = onExit(() => {
		spawned.kill();
	});

	return timedPromise.finally(() => {
		removeExitHandler();
	});
};

;// CONCATENATED MODULE: external "node:fs"
const external_node_fs_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:fs");
;// CONCATENATED MODULE: ./node_modules/is-stream/index.js
function isStream(stream) {
	return stream !== null
		&& typeof stream === 'object'
		&& typeof stream.pipe === 'function';
}

function isWritableStream(stream) {
	return isStream(stream)
		&& stream.writable !== false
		&& typeof stream._write === 'function'
		&& typeof stream._writableState === 'object';
}

function isReadableStream(stream) {
	return isStream(stream)
		&& stream.readable !== false
		&& typeof stream._read === 'function'
		&& typeof stream._readableState === 'object';
}

function isDuplexStream(stream) {
	return isWritableStream(stream)
		&& isReadableStream(stream);
}

function isTransformStream(stream) {
	return isDuplexStream(stream)
		&& typeof stream._transform === 'function';
}

;// CONCATENATED MODULE: ./node_modules/execa/lib/pipe.js




const isExecaChildProcess = target => target instanceof external_node_child_process_namespaceObject.ChildProcess && typeof target.then === 'function';

const pipeToTarget = (spawned, streamName, target) => {
	if (typeof target === 'string') {
		spawned[streamName].pipe((0,external_node_fs_namespaceObject.createWriteStream)(target));
		return spawned;
	}

	if (isWritableStream(target)) {
		spawned[streamName].pipe(target);
		return spawned;
	}

	if (!isExecaChildProcess(target)) {
		throw new TypeError('The second argument must be a string, a stream or an Execa child process.');
	}

	if (!isWritableStream(target.stdin)) {
		throw new TypeError('The target child process\'s stdin must be available.');
	}

	spawned[streamName].pipe(target.stdin);
	return target;
};

const addPipeMethods = spawned => {
	if (spawned.stdout !== null) {
		spawned.pipeStdout = pipeToTarget.bind(undefined, spawned, 'stdout');
	}

	if (spawned.stderr !== null) {
		spawned.pipeStderr = pipeToTarget.bind(undefined, spawned, 'stderr');
	}

	if (spawned.all !== undefined) {
		spawned.pipeAll = pipeToTarget.bind(undefined, spawned, 'all');
	}
};

;// CONCATENATED MODULE: external "node:timers/promises"
const promises_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:timers/promises");
;// CONCATENATED MODULE: ./node_modules/execa/node_modules/get-stream/source/contents.js
const contents_getStreamContents = async (stream, {init, convertChunk, getSize, truncateChunk, addChunk, getFinalChunk, finalize}, {maxBuffer = Number.POSITIVE_INFINITY} = {}) => {
	if (!isAsyncIterable(stream)) {
		throw new Error('The first argument must be a Readable, a ReadableStream, or an async iterable.');
	}

	const state = init();
	state.length = 0;

	try {
		for await (const chunk of stream) {
			const chunkType = getChunkType(chunk);
			const convertedChunk = convertChunk[chunkType](chunk, state);
			appendChunk({convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer});
		}

		appendFinalChunk({state, convertChunk, getSize, truncateChunk, addChunk, getFinalChunk, maxBuffer});
		return finalize(state);
	} catch (error) {
		error.bufferedData = finalize(state);
		throw error;
	}
};

const appendFinalChunk = ({state, getSize, truncateChunk, addChunk, getFinalChunk, maxBuffer}) => {
	const convertedChunk = getFinalChunk(state);
	if (convertedChunk !== undefined) {
		appendChunk({convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer});
	}
};

const appendChunk = ({convertedChunk, state, getSize, truncateChunk, addChunk, maxBuffer}) => {
	const chunkSize = getSize(convertedChunk);
	const newLength = state.length + chunkSize;

	if (newLength <= maxBuffer) {
		addNewChunk(convertedChunk, state, addChunk, newLength);
		return;
	}

	const truncatedChunk = truncateChunk(convertedChunk, maxBuffer - state.length);

	if (truncatedChunk !== undefined) {
		addNewChunk(truncatedChunk, state, addChunk, maxBuffer);
	}

	throw new MaxBufferError();
};

const addNewChunk = (convertedChunk, state, addChunk, newLength) => {
	state.contents = addChunk(convertedChunk, state, newLength);
	state.length = newLength;
};

const isAsyncIterable = stream => typeof stream === 'object' && stream !== null && typeof stream[Symbol.asyncIterator] === 'function';

const getChunkType = chunk => {
	const typeOfChunk = typeof chunk;

	if (typeOfChunk === 'string') {
		return 'string';
	}

	if (typeOfChunk !== 'object' || chunk === null) {
		return 'others';
	}

	// eslint-disable-next-line n/prefer-global/buffer
	if (globalThis.Buffer?.isBuffer(chunk)) {
		return 'buffer';
	}

	const prototypeName = objectToString.call(chunk);

	if (prototypeName === '[object ArrayBuffer]') {
		return 'arrayBuffer';
	}

	if (prototypeName === '[object DataView]') {
		return 'dataView';
	}

	if (
		Number.isInteger(chunk.byteLength)
		&& Number.isInteger(chunk.byteOffset)
		&& objectToString.call(chunk.buffer) === '[object ArrayBuffer]'
	) {
		return 'typedArray';
	}

	return 'others';
};

const {toString: objectToString} = Object.prototype;

class MaxBufferError extends Error {
	name = 'MaxBufferError';

	constructor() {
		super('maxBuffer exceeded');
	}
}

;// CONCATENATED MODULE: ./node_modules/execa/node_modules/get-stream/source/utils.js
const identity = value => value;

const noop = () => undefined;

const getContentsProp = ({contents}) => contents;

const throwObjectStream = chunk => {
	throw new Error(`Streams in object mode are not supported: ${String(chunk)}`);
};

const getLengthProp = convertedChunk => convertedChunk.length;

;// CONCATENATED MODULE: ./node_modules/execa/node_modules/get-stream/source/array.js



async function getStreamAsArray(stream, options) {
	return getStreamContents(stream, arrayMethods, options);
}

const initArray = () => ({contents: []});

const increment = () => 1;

const addArrayChunk = (convertedChunk, {contents}) => {
	contents.push(convertedChunk);
	return contents;
};

const arrayMethods = {
	init: initArray,
	convertChunk: {
		string: identity,
		buffer: identity,
		arrayBuffer: identity,
		dataView: identity,
		typedArray: identity,
		others: identity,
	},
	getSize: increment,
	truncateChunk: noop,
	addChunk: addArrayChunk,
	getFinalChunk: noop,
	finalize: getContentsProp,
};

;// CONCATENATED MODULE: ./node_modules/execa/node_modules/get-stream/source/array-buffer.js



async function getStreamAsArrayBuffer(stream, options) {
	return contents_getStreamContents(stream, arrayBufferMethods, options);
}

const initArrayBuffer = () => ({contents: new ArrayBuffer(0)});

const useTextEncoder = chunk => textEncoder.encode(chunk);
const textEncoder = new TextEncoder();

const useUint8Array = chunk => new Uint8Array(chunk);

const useUint8ArrayWithOffset = chunk => new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);

const truncateArrayBufferChunk = (convertedChunk, chunkSize) => convertedChunk.slice(0, chunkSize);

// `contents` is an increasingly growing `Uint8Array`.
const addArrayBufferChunk = (convertedChunk, {contents, length: previousLength}, length) => {
	const newContents = hasArrayBufferResize() ? resizeArrayBuffer(contents, length) : resizeArrayBufferSlow(contents, length);
	new Uint8Array(newContents).set(convertedChunk, previousLength);
	return newContents;
};

// Without `ArrayBuffer.resize()`, `contents` size is always a power of 2.
// This means its last bytes are zeroes (not stream data), which need to be
// trimmed at the end with `ArrayBuffer.slice()`.
const resizeArrayBufferSlow = (contents, length) => {
	if (length <= contents.byteLength) {
		return contents;
	}

	const arrayBuffer = new ArrayBuffer(getNewContentsLength(length));
	new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
	return arrayBuffer;
};

// With `ArrayBuffer.resize()`, `contents` size matches exactly the size of
// the stream data. It does not include extraneous zeroes to trim at the end.
// The underlying `ArrayBuffer` does allocate a number of bytes that is a power
// of 2, but those bytes are only visible after calling `ArrayBuffer.resize()`.
const resizeArrayBuffer = (contents, length) => {
	if (length <= contents.maxByteLength) {
		contents.resize(length);
		return contents;
	}

	const arrayBuffer = new ArrayBuffer(length, {maxByteLength: getNewContentsLength(length)});
	new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0);
	return arrayBuffer;
};

// Retrieve the closest `length` that is both >= and a power of 2
const getNewContentsLength = length => SCALE_FACTOR ** Math.ceil(Math.log(length) / Math.log(SCALE_FACTOR));

const SCALE_FACTOR = 2;

const finalizeArrayBuffer = ({contents, length}) => hasArrayBufferResize() ? contents : contents.slice(0, length);

// `ArrayBuffer.slice()` is slow. When `ArrayBuffer.resize()` is available
// (Node >=20.0.0, Safari >=16.4 and Chrome), we can use it instead.
// eslint-disable-next-line no-warning-comments
// TODO: remove after dropping support for Node 20.
// eslint-disable-next-line no-warning-comments
// TODO: use `ArrayBuffer.transferToFixedLength()` instead once it is available
const hasArrayBufferResize = () => 'resize' in ArrayBuffer.prototype;

const arrayBufferMethods = {
	init: initArrayBuffer,
	convertChunk: {
		string: useTextEncoder,
		buffer: useUint8Array,
		arrayBuffer: useUint8Array,
		dataView: useUint8ArrayWithOffset,
		typedArray: useUint8ArrayWithOffset,
		others: throwObjectStream,
	},
	getSize: getLengthProp,
	truncateChunk: truncateArrayBufferChunk,
	addChunk: addArrayBufferChunk,
	getFinalChunk: noop,
	finalize: finalizeArrayBuffer,
};

;// CONCATENATED MODULE: ./node_modules/execa/node_modules/get-stream/source/buffer.js


async function getStreamAsBuffer(stream, options) {
	if (!('Buffer' in globalThis)) {
		throw new Error('getStreamAsBuffer() is only supported in Node.js');
	}

	try {
		return arrayBufferToNodeBuffer(await getStreamAsArrayBuffer(stream, options));
	} catch (error) {
		if (error.bufferedData !== undefined) {
			error.bufferedData = arrayBufferToNodeBuffer(error.bufferedData);
		}

		throw error;
	}
}

// eslint-disable-next-line n/prefer-global/buffer
const arrayBufferToNodeBuffer = arrayBuffer => globalThis.Buffer.from(arrayBuffer);

;// CONCATENATED MODULE: ./node_modules/execa/node_modules/get-stream/source/string.js



async function getStreamAsString(stream, options) {
	return contents_getStreamContents(stream, stringMethods, options);
}

const initString = () => ({contents: '', textDecoder: new TextDecoder()});

const useTextDecoder = (chunk, {textDecoder}) => textDecoder.decode(chunk, {stream: true});

const addStringChunk = (convertedChunk, {contents}) => contents + convertedChunk;

const truncateStringChunk = (convertedChunk, chunkSize) => convertedChunk.slice(0, chunkSize);

const getFinalStringChunk = ({textDecoder}) => {
	const finalChunk = textDecoder.decode();
	return finalChunk === '' ? undefined : finalChunk;
};

const stringMethods = {
	init: initString,
	convertChunk: {
		string: identity,
		buffer: useTextDecoder,
		arrayBuffer: useTextDecoder,
		dataView: useTextDecoder,
		typedArray: useTextDecoder,
		others: throwObjectStream,
	},
	getSize: getLengthProp,
	truncateChunk: truncateStringChunk,
	addChunk: addStringChunk,
	getFinalChunk: getFinalStringChunk,
	finalize: getContentsProp,
};

;// CONCATENATED MODULE: ./node_modules/execa/node_modules/get-stream/source/index.js






// EXTERNAL MODULE: ./node_modules/merge-stream/index.js
var merge_stream = __nccwpck_require__(2621);
;// CONCATENATED MODULE: ./node_modules/execa/lib/stream.js






const validateInputOptions = input => {
	if (input !== undefined) {
		throw new TypeError('The `input` and `inputFile` options cannot be both set.');
	}
};

const getInputSync = ({input, inputFile}) => {
	if (typeof inputFile !== 'string') {
		return input;
	}

	validateInputOptions(input);
	return (0,external_node_fs_namespaceObject.readFileSync)(inputFile);
};

// `input` and `inputFile` option in sync mode
const handleInputSync = options => {
	const input = getInputSync(options);

	if (isStream(input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}

	return input;
};

const getInput = ({input, inputFile}) => {
	if (typeof inputFile !== 'string') {
		return input;
	}

	validateInputOptions(input);
	return (0,external_node_fs_namespaceObject.createReadStream)(inputFile);
};

// `input` and `inputFile` option in async mode
const handleInput = (spawned, options) => {
	const input = getInput(options);

	if (input === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
};

// `all` interleaves `stdout` and `stderr`
const makeAllStream = (spawned, {all}) => {
	if (!all || (!spawned.stdout && !spawned.stderr)) {
		return;
	}

	const mixed = merge_stream();

	if (spawned.stdout) {
		mixed.add(spawned.stdout);
	}

	if (spawned.stderr) {
		mixed.add(spawned.stderr);
	}

	return mixed;
};

// On failure, `result.stdout|stderr|all` should contain the currently buffered stream
const getBufferedData = async (stream, streamPromise) => {
	// When `buffer` is `false`, `streamPromise` is `undefined` and there is no buffered data to retrieve
	if (!stream || streamPromise === undefined) {
		return;
	}

	// Wait for the `all` stream to receive the last chunk before destroying the stream
	await (0,promises_namespaceObject.setTimeout)(0);

	stream.destroy();

	try {
		return await streamPromise;
	} catch (error) {
		return error.bufferedData;
	}
};

const getStreamPromise = (stream, {encoding, buffer, maxBuffer}) => {
	if (!stream || !buffer) {
		return;
	}

	// eslint-disable-next-line unicorn/text-encoding-identifier-case
	if (encoding === 'utf8' || encoding === 'utf-8') {
		return getStreamAsString(stream, {maxBuffer});
	}

	if (encoding === null || encoding === 'buffer') {
		return getStreamAsBuffer(stream, {maxBuffer});
	}

	return applyEncoding(stream, maxBuffer, encoding);
};

const applyEncoding = async (stream, maxBuffer, encoding) => {
	const buffer = await getStreamAsBuffer(stream, {maxBuffer});
	return buffer.toString(encoding);
};

// Retrieve result of child process: exit code, signal, error, streams (stdout/stderr/all)
const getSpawnedResult = async ({stdout, stderr, all}, {encoding, buffer, maxBuffer}, processDone) => {
	const stdoutPromise = getStreamPromise(stdout, {encoding, buffer, maxBuffer});
	const stderrPromise = getStreamPromise(stderr, {encoding, buffer, maxBuffer});
	const allPromise = getStreamPromise(all, {encoding, buffer, maxBuffer: maxBuffer * 2});

	try {
		return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
	} catch (error) {
		return Promise.all([
			{error, signal: error.signal, timedOut: error.timedOut},
			getBufferedData(stdout, stdoutPromise),
			getBufferedData(stderr, stderrPromise),
			getBufferedData(all, allPromise),
		]);
	}
};

;// CONCATENATED MODULE: ./node_modules/execa/lib/promise.js
// eslint-disable-next-line unicorn/prefer-top-level-await
const nativePromisePrototype = (async () => {})().constructor.prototype;

const descriptors = ['then', 'catch', 'finally'].map(property => [
	property,
	Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property),
]);

// The return value is a mixin of `childProcess` and `Promise`
const mergePromise = (spawned, promise) => {
	for (const [property, descriptor] of descriptors) {
		// Starting the main `promise` is deferred to avoid consuming streams
		const value = typeof promise === 'function'
			? (...args) => Reflect.apply(descriptor.value, promise(), args)
			: descriptor.value.bind(promise);

		Reflect.defineProperty(spawned, property, {...descriptor, value});
	}
};

// Use promises instead of `child_process` events
const getSpawnedPromise = spawned => new Promise((resolve, reject) => {
	spawned.on('exit', (exitCode, signal) => {
		resolve({exitCode, signal});
	});

	spawned.on('error', error => {
		reject(error);
	});

	if (spawned.stdin) {
		spawned.stdin.on('error', error => {
			reject(error);
		});
	}
});

;// CONCATENATED MODULE: ./node_modules/execa/lib/command.js



const normalizeArgs = (file, args = []) => {
	if (!Array.isArray(args)) {
		return [file];
	}

	return [file, ...args];
};

const NO_ESCAPE_REGEXP = /^[\w.-]+$/;

const escapeArg = arg => {
	if (typeof arg !== 'string' || NO_ESCAPE_REGEXP.test(arg)) {
		return arg;
	}

	return `"${arg.replaceAll('"', '\\"')}"`;
};

const joinCommand = (file, args) => normalizeArgs(file, args).join(' ');

const getEscapedCommand = (file, args) => normalizeArgs(file, args).map(arg => escapeArg(arg)).join(' ');

const SPACES_REGEXP = / +/g;

// Handle `execaCommand()`
const command_parseCommand = command => {
	const tokens = [];
	for (const token of command.trim().split(SPACES_REGEXP)) {
		// Allow spaces to be escaped by a backslash if not meant as a delimiter
		const previousToken = tokens.at(-1);
		if (previousToken && previousToken.endsWith('\\')) {
			// Merge previous token with current one
			tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
		} else {
			tokens.push(token);
		}
	}

	return tokens;
};

const parseExpression = expression => {
	const typeOfExpression = typeof expression;

	if (typeOfExpression === 'string') {
		return expression;
	}

	if (typeOfExpression === 'number') {
		return String(expression);
	}

	if (
		typeOfExpression === 'object'
		&& expression !== null
		&& !(expression instanceof external_node_child_process_namespaceObject.ChildProcess)
		&& 'stdout' in expression
	) {
		const typeOfStdout = typeof expression.stdout;

		if (typeOfStdout === 'string') {
			return expression.stdout;
		}

		if (external_node_buffer_namespaceObject.Buffer.isBuffer(expression.stdout)) {
			return expression.stdout.toString();
		}

		throw new TypeError(`Unexpected "${typeOfStdout}" stdout in template expression`);
	}

	throw new TypeError(`Unexpected "${typeOfExpression}" in template expression`);
};

const concatTokens = (tokens, nextTokens, isNew) => isNew || tokens.length === 0 || nextTokens.length === 0
	? [...tokens, ...nextTokens]
	: [
		...tokens.slice(0, -1),
		`${tokens.at(-1)}${nextTokens[0]}`,
		...nextTokens.slice(1),
	];

const parseTemplate = ({templates, expressions, tokens, index, template}) => {
	const templateString = template ?? templates.raw[index];
	const templateTokens = templateString.split(SPACES_REGEXP).filter(Boolean);
	const newTokens = concatTokens(
		tokens,
		templateTokens,
		templateString.startsWith(' '),
	);

	if (index === expressions.length) {
		return newTokens;
	}

	const expression = expressions[index];
	const expressionTokens = Array.isArray(expression)
		? expression.map(expression => parseExpression(expression))
		: [parseExpression(expression)];
	return concatTokens(
		newTokens,
		expressionTokens,
		templateString.endsWith(' '),
	);
};

const parseTemplates = (templates, expressions) => {
	let tokens = [];

	for (const [index, template] of templates.entries()) {
		tokens = parseTemplate({templates, expressions, tokens, index, template});
	}

	return tokens;
};


;// CONCATENATED MODULE: external "node:util"
const external_node_util_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:util");
;// CONCATENATED MODULE: ./node_modules/execa/lib/verbose.js



const verboseDefault = (0,external_node_util_namespaceObject.debuglog)('execa').enabled;

const padField = (field, padding) => String(field).padStart(padding, '0');

const getTimestamp = () => {
	const date = new Date();
	return `${padField(date.getHours(), 2)}:${padField(date.getMinutes(), 2)}:${padField(date.getSeconds(), 2)}.${padField(date.getMilliseconds(), 3)}`;
};

const logCommand = (escapedCommand, {verbose}) => {
	if (!verbose) {
		return;
	}

	external_node_process_namespaceObject.stderr.write(`[${getTimestamp()}] ${escapedCommand}\n`);
};

;// CONCATENATED MODULE: ./node_modules/execa/index.js

















const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;

const getEnv = ({env: envOption, extendEnv, preferLocal, localDir, execPath}) => {
	const env = extendEnv ? {...external_node_process_namespaceObject.env, ...envOption} : envOption;

	if (preferLocal) {
		return npmRunPathEnv({env, cwd: localDir, execPath});
	}

	return env;
};

const handleArguments = (file, args, options = {}) => {
	const parsed = cross_spawn._parse(file, args, options);
	file = parsed.command;
	args = parsed.args;
	options = parsed.options;

	options = {
		maxBuffer: DEFAULT_MAX_BUFFER,
		buffer: true,
		stripFinalNewline: true,
		extendEnv: true,
		preferLocal: false,
		localDir: options.cwd || external_node_process_namespaceObject.cwd(),
		execPath: external_node_process_namespaceObject.execPath,
		encoding: 'utf8',
		reject: true,
		cleanup: true,
		all: false,
		windowsHide: true,
		verbose: verboseDefault,
		...options,
	};

	options.env = getEnv(options);

	options.stdio = normalizeStdio(options);

	if (external_node_process_namespaceObject.platform === 'win32' && external_node_path_namespaceObject.basename(file, '.exe') === 'cmd') {
		// #116
		args.unshift('/q');
	}

	return {file, args, options, parsed};
};

const handleOutput = (options, value, error) => {
	if (typeof value !== 'string' && !external_node_buffer_namespaceObject.Buffer.isBuffer(value)) {
		// When `execaSync()` errors, we normalize it to '' to mimic `execa()`
		return error === undefined ? undefined : '';
	}

	if (options.stripFinalNewline) {
		return stripFinalNewline(value);
	}

	return value;
};

function execa(file, args, options) {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);
	const escapedCommand = getEscapedCommand(file, args);
	logCommand(escapedCommand, parsed.options);

	validateTimeout(parsed.options);

	let spawned;
	try {
		spawned = external_node_child_process_namespaceObject.spawn(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		// Ensure the returned error is always both a promise and a child process
		const dummySpawned = new external_node_child_process_namespaceObject.ChildProcess();
		const errorPromise = Promise.reject(makeError({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			escapedCommand,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false,
		}));
		mergePromise(dummySpawned, errorPromise);
		return dummySpawned;
	}

	const spawnedPromise = getSpawnedPromise(spawned);
	const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
	const processDone = setExitHandler(spawned, parsed.options, timedPromise);

	const context = {isCanceled: false};

	spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
	spawned.cancel = spawnedCancel.bind(null, spawned, context);

	const handlePromise = async () => {
		const [{error, exitCode, signal, timedOut}, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
		const stdout = handleOutput(parsed.options, stdoutResult);
		const stderr = handleOutput(parsed.options, stderrResult);
		const all = handleOutput(parsed.options, allResult);

		if (error || exitCode !== 0 || signal !== null) {
			const returnedError = makeError({
				error,
				exitCode,
				signal,
				stdout,
				stderr,
				all,
				command,
				escapedCommand,
				parsed,
				timedOut,
				isCanceled: context.isCanceled || (parsed.options.signal ? parsed.options.signal.aborted : false),
				killed: spawned.killed,
			});

			if (!parsed.options.reject) {
				return returnedError;
			}

			throw returnedError;
		}

		return {
			command,
			escapedCommand,
			exitCode: 0,
			stdout,
			stderr,
			all,
			failed: false,
			timedOut: false,
			isCanceled: false,
			killed: false,
		};
	};

	const handlePromiseOnce = node_modules_onetime(handlePromise);

	handleInput(spawned, parsed.options);

	spawned.all = makeAllStream(spawned, parsed.options);

	addPipeMethods(spawned);
	mergePromise(spawned, handlePromiseOnce);
	return spawned;
}

function execaSync(file, args, options) {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);
	const escapedCommand = getEscapedCommand(file, args);
	logCommand(escapedCommand, parsed.options);

	const input = handleInputSync(parsed.options);

	let result;
	try {
		result = external_node_child_process_namespaceObject.spawnSync(parsed.file, parsed.args, {...parsed.options, input});
	} catch (error) {
		throw makeError({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			escapedCommand,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false,
		});
	}

	const stdout = handleOutput(parsed.options, result.stdout, result.error);
	const stderr = handleOutput(parsed.options, result.stderr, result.error);

	if (result.error || result.status !== 0 || result.signal !== null) {
		const error = makeError({
			stdout,
			stderr,
			error: result.error,
			signal: result.signal,
			exitCode: result.status,
			command,
			escapedCommand,
			parsed,
			timedOut: result.error && result.error.code === 'ETIMEDOUT',
			isCanceled: false,
			killed: result.signal !== null,
		});

		if (!parsed.options.reject) {
			return error;
		}

		throw error;
	}

	return {
		command,
		escapedCommand,
		exitCode: 0,
		stdout,
		stderr,
		failed: false,
		timedOut: false,
		isCanceled: false,
		killed: false,
	};
}

const normalizeScriptStdin = ({input, inputFile, stdio}) => input === undefined && inputFile === undefined && stdio === undefined
	? {stdin: 'inherit'}
	: {};

const normalizeScriptOptions = (options = {}) => ({
	preferLocal: true,
	...normalizeScriptStdin(options),
	...options,
});

function create$(options) {
	function $(templatesOrOptions, ...expressions) {
		if (!Array.isArray(templatesOrOptions)) {
			return create$({...options, ...templatesOrOptions});
		}

		const [file, ...args] = parseTemplates(templatesOrOptions, expressions);
		return execa(file, args, normalizeScriptOptions(options));
	}

	$.sync = (templates, ...expressions) => {
		if (!Array.isArray(templates)) {
			throw new TypeError('Please use $(options).sync`command` instead of $.sync(options)`command`.');
		}

		const [file, ...args] = parseTemplates(templates, expressions);
		return execaSync(file, args, normalizeScriptOptions(options));
	};

	return $;
}

const $ = create$();

function execaCommand(command, options) {
	const [file, ...args] = command_parseCommand(command);
	return execa(file, args, options);
}

function execaCommandSync(command, options) {
	const [file, ...args] = parseCommand(command);
	return execaSync(file, args, options);
}

function execaNode(scriptPath, args, options = {}) {
	if (args && !Array.isArray(args) && typeof args === 'object') {
		options = args;
		args = [];
	}

	const stdio = normalizeStdioNode(options);
	const defaultExecArgv = process.execArgv.filter(arg => !arg.startsWith('--inspect'));

	const {
		nodePath = process.execPath,
		nodeOptions = defaultExecArgv,
	} = options;

	return execa(
		nodePath,
		[
			...nodeOptions,
			scriptPath,
			...(Array.isArray(args) ? args : []),
		],
		{
			...options,
			stdin: undefined,
			stdout: undefined,
			stderr: undefined,
			stdio,
			shell: false,
		},
	);
}

// EXTERNAL MODULE: ./node_modules/restore-cursor/node_modules/onetime/index.js
var restore_cursor_node_modules_onetime = __nccwpck_require__(4536);
// EXTERNAL MODULE: ./node_modules/signal-exit/index.js
var signal_exit = __nccwpck_require__(4931);
;// CONCATENATED MODULE: ./node_modules/restore-cursor/index.js




const restoreCursor = restore_cursor_node_modules_onetime(() => {
	signal_exit(() => {
		external_node_process_namespaceObject.stderr.write('\u001B[?25h');
	}, {alwaysLast: true});
});

/* harmony default export */ const restore_cursor = (restoreCursor);

;// CONCATENATED MODULE: ./node_modules/cli-cursor/index.js



let isHidden = false;

const cliCursor = {};

cliCursor.show = (writableStream = external_node_process_namespaceObject.stderr) => {
	if (!writableStream.isTTY) {
		return;
	}

	isHidden = false;
	writableStream.write('\u001B[?25h');
};

cliCursor.hide = (writableStream = external_node_process_namespaceObject.stderr) => {
	if (!writableStream.isTTY) {
		return;
	}

	restore_cursor();
	isHidden = true;
	writableStream.write('\u001B[?25l');
};

cliCursor.toggle = (force, writableStream) => {
	if (force !== undefined) {
		isHidden = force;
	}

	if (isHidden) {
		cliCursor.show(writableStream);
	} else {
		cliCursor.hide(writableStream);
	}
};

/* harmony default export */ const cli_cursor = (cliCursor);

// EXTERNAL MODULE: ./node_modules/cli-spinners/index.js
var cli_spinners = __nccwpck_require__(2031);
;// CONCATENATED MODULE: ./node_modules/is-unicode-supported/index.js


function isUnicodeSupported() {
	if (external_node_process_namespaceObject.platform !== 'win32') {
		return external_node_process_namespaceObject.env.TERM !== 'linux'; // Linux console (kernel)
	}

	return Boolean(external_node_process_namespaceObject.env.CI)
		|| Boolean(external_node_process_namespaceObject.env.WT_SESSION) // Windows Terminal
		|| Boolean(external_node_process_namespaceObject.env.TERMINUS_SUBLIME) // Terminus (<0.2.27)
		|| external_node_process_namespaceObject.env.ConEmuTask === '{cmd::Cmder}' // ConEmu and cmder
		|| external_node_process_namespaceObject.env.TERM_PROGRAM === 'Terminus-Sublime'
		|| external_node_process_namespaceObject.env.TERM_PROGRAM === 'vscode'
		|| external_node_process_namespaceObject.env.TERM === 'xterm-256color'
		|| external_node_process_namespaceObject.env.TERM === 'alacritty'
		|| external_node_process_namespaceObject.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm';
}

;// CONCATENATED MODULE: ./node_modules/log-symbols/index.js



const main = {
	info: source.blue('ℹ'),
	success: source.green('✔'),
	warning: source.yellow('⚠'),
	error: source.red('✖'),
};

const fallback = {
	info: source.blue('i'),
	success: source.green('√'),
	warning: source.yellow('‼'),
	error: source.red('×'),
};

const logSymbols = isUnicodeSupported() ? main : fallback;

/* harmony default export */ const log_symbols = (logSymbols);

;// CONCATENATED MODULE: ./node_modules/ora/node_modules/ansi-regex/index.js
function ansiRegex({onlyFirst = false} = {}) {
	const pattern = [
	    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

;// CONCATENATED MODULE: ./node_modules/ora/node_modules/strip-ansi/index.js


const regex = ansiRegex();

function stripAnsi(string) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
	}

	// Even though the regex is global, we don't need to reset the `.lastIndex`
	// because unlike `.exec()` and `.test()`, `.replace()` does it automatically
	// and doing it manually has a performance penalty.
	return string.replace(regex, '');
}

;// CONCATENATED MODULE: ./node_modules/get-east-asian-width/lookup.js
// Generated code.

function isAmbiguous(x) {
	return x === 0xA1
		|| x === 0xA4
		|| x === 0xA7
		|| x === 0xA8
		|| x === 0xAA
		|| x === 0xAD
		|| x === 0xAE
		|| x >= 0xB0 && x <= 0xB4
		|| x >= 0xB6 && x <= 0xBA
		|| x >= 0xBC && x <= 0xBF
		|| x === 0xC6
		|| x === 0xD0
		|| x === 0xD7
		|| x === 0xD8
		|| x >= 0xDE && x <= 0xE1
		|| x === 0xE6
		|| x >= 0xE8 && x <= 0xEA
		|| x === 0xEC
		|| x === 0xED
		|| x === 0xF0
		|| x === 0xF2
		|| x === 0xF3
		|| x >= 0xF7 && x <= 0xFA
		|| x === 0xFC
		|| x === 0xFE
		|| x === 0x101
		|| x === 0x111
		|| x === 0x113
		|| x === 0x11B
		|| x === 0x126
		|| x === 0x127
		|| x === 0x12B
		|| x >= 0x131 && x <= 0x133
		|| x === 0x138
		|| x >= 0x13F && x <= 0x142
		|| x === 0x144
		|| x >= 0x148 && x <= 0x14B
		|| x === 0x14D
		|| x === 0x152
		|| x === 0x153
		|| x === 0x166
		|| x === 0x167
		|| x === 0x16B
		|| x === 0x1CE
		|| x === 0x1D0
		|| x === 0x1D2
		|| x === 0x1D4
		|| x === 0x1D6
		|| x === 0x1D8
		|| x === 0x1DA
		|| x === 0x1DC
		|| x === 0x251
		|| x === 0x261
		|| x === 0x2C4
		|| x === 0x2C7
		|| x >= 0x2C9 && x <= 0x2CB
		|| x === 0x2CD
		|| x === 0x2D0
		|| x >= 0x2D8 && x <= 0x2DB
		|| x === 0x2DD
		|| x === 0x2DF
		|| x >= 0x300 && x <= 0x36F
		|| x >= 0x391 && x <= 0x3A1
		|| x >= 0x3A3 && x <= 0x3A9
		|| x >= 0x3B1 && x <= 0x3C1
		|| x >= 0x3C3 && x <= 0x3C9
		|| x === 0x401
		|| x >= 0x410 && x <= 0x44F
		|| x === 0x451
		|| x === 0x2010
		|| x >= 0x2013 && x <= 0x2016
		|| x === 0x2018
		|| x === 0x2019
		|| x === 0x201C
		|| x === 0x201D
		|| x >= 0x2020 && x <= 0x2022
		|| x >= 0x2024 && x <= 0x2027
		|| x === 0x2030
		|| x === 0x2032
		|| x === 0x2033
		|| x === 0x2035
		|| x === 0x203B
		|| x === 0x203E
		|| x === 0x2074
		|| x === 0x207F
		|| x >= 0x2081 && x <= 0x2084
		|| x === 0x20AC
		|| x === 0x2103
		|| x === 0x2105
		|| x === 0x2109
		|| x === 0x2113
		|| x === 0x2116
		|| x === 0x2121
		|| x === 0x2122
		|| x === 0x2126
		|| x === 0x212B
		|| x === 0x2153
		|| x === 0x2154
		|| x >= 0x215B && x <= 0x215E
		|| x >= 0x2160 && x <= 0x216B
		|| x >= 0x2170 && x <= 0x2179
		|| x === 0x2189
		|| x >= 0x2190 && x <= 0x2199
		|| x === 0x21B8
		|| x === 0x21B9
		|| x === 0x21D2
		|| x === 0x21D4
		|| x === 0x21E7
		|| x === 0x2200
		|| x === 0x2202
		|| x === 0x2203
		|| x === 0x2207
		|| x === 0x2208
		|| x === 0x220B
		|| x === 0x220F
		|| x === 0x2211
		|| x === 0x2215
		|| x === 0x221A
		|| x >= 0x221D && x <= 0x2220
		|| x === 0x2223
		|| x === 0x2225
		|| x >= 0x2227 && x <= 0x222C
		|| x === 0x222E
		|| x >= 0x2234 && x <= 0x2237
		|| x === 0x223C
		|| x === 0x223D
		|| x === 0x2248
		|| x === 0x224C
		|| x === 0x2252
		|| x === 0x2260
		|| x === 0x2261
		|| x >= 0x2264 && x <= 0x2267
		|| x === 0x226A
		|| x === 0x226B
		|| x === 0x226E
		|| x === 0x226F
		|| x === 0x2282
		|| x === 0x2283
		|| x === 0x2286
		|| x === 0x2287
		|| x === 0x2295
		|| x === 0x2299
		|| x === 0x22A5
		|| x === 0x22BF
		|| x === 0x2312
		|| x >= 0x2460 && x <= 0x24E9
		|| x >= 0x24EB && x <= 0x254B
		|| x >= 0x2550 && x <= 0x2573
		|| x >= 0x2580 && x <= 0x258F
		|| x >= 0x2592 && x <= 0x2595
		|| x === 0x25A0
		|| x === 0x25A1
		|| x >= 0x25A3 && x <= 0x25A9
		|| x === 0x25B2
		|| x === 0x25B3
		|| x === 0x25B6
		|| x === 0x25B7
		|| x === 0x25BC
		|| x === 0x25BD
		|| x === 0x25C0
		|| x === 0x25C1
		|| x >= 0x25C6 && x <= 0x25C8
		|| x === 0x25CB
		|| x >= 0x25CE && x <= 0x25D1
		|| x >= 0x25E2 && x <= 0x25E5
		|| x === 0x25EF
		|| x === 0x2605
		|| x === 0x2606
		|| x === 0x2609
		|| x === 0x260E
		|| x === 0x260F
		|| x === 0x261C
		|| x === 0x261E
		|| x === 0x2640
		|| x === 0x2642
		|| x === 0x2660
		|| x === 0x2661
		|| x >= 0x2663 && x <= 0x2665
		|| x >= 0x2667 && x <= 0x266A
		|| x === 0x266C
		|| x === 0x266D
		|| x === 0x266F
		|| x === 0x269E
		|| x === 0x269F
		|| x === 0x26BF
		|| x >= 0x26C6 && x <= 0x26CD
		|| x >= 0x26CF && x <= 0x26D3
		|| x >= 0x26D5 && x <= 0x26E1
		|| x === 0x26E3
		|| x === 0x26E8
		|| x === 0x26E9
		|| x >= 0x26EB && x <= 0x26F1
		|| x === 0x26F4
		|| x >= 0x26F6 && x <= 0x26F9
		|| x === 0x26FB
		|| x === 0x26FC
		|| x === 0x26FE
		|| x === 0x26FF
		|| x === 0x273D
		|| x >= 0x2776 && x <= 0x277F
		|| x >= 0x2B56 && x <= 0x2B59
		|| x >= 0x3248 && x <= 0x324F
		|| x >= 0xE000 && x <= 0xF8FF
		|| x >= 0xFE00 && x <= 0xFE0F
		|| x === 0xFFFD
		|| x >= 0x1F100 && x <= 0x1F10A
		|| x >= 0x1F110 && x <= 0x1F12D
		|| x >= 0x1F130 && x <= 0x1F169
		|| x >= 0x1F170 && x <= 0x1F18D
		|| x === 0x1F18F
		|| x === 0x1F190
		|| x >= 0x1F19B && x <= 0x1F1AC
		|| x >= 0xE0100 && x <= 0xE01EF
		|| x >= 0xF0000 && x <= 0xFFFFD
		|| x >= 0x100000 && x <= 0x10FFFD;
}

function lookup_isFullWidth(x) {
	return x === 0x3000
		|| x >= 0xFF01 && x <= 0xFF60
		|| x >= 0xFFE0 && x <= 0xFFE6;
}

function lookup_isWide(x) {
	return x >= 0x1100 && x <= 0x115F
		|| x === 0x231A
		|| x === 0x231B
		|| x === 0x2329
		|| x === 0x232A
		|| x >= 0x23E9 && x <= 0x23EC
		|| x === 0x23F0
		|| x === 0x23F3
		|| x === 0x25FD
		|| x === 0x25FE
		|| x === 0x2614
		|| x === 0x2615
		|| x >= 0x2648 && x <= 0x2653
		|| x === 0x267F
		|| x === 0x2693
		|| x === 0x26A1
		|| x === 0x26AA
		|| x === 0x26AB
		|| x === 0x26BD
		|| x === 0x26BE
		|| x === 0x26C4
		|| x === 0x26C5
		|| x === 0x26CE
		|| x === 0x26D4
		|| x === 0x26EA
		|| x === 0x26F2
		|| x === 0x26F3
		|| x === 0x26F5
		|| x === 0x26FA
		|| x === 0x26FD
		|| x === 0x2705
		|| x === 0x270A
		|| x === 0x270B
		|| x === 0x2728
		|| x === 0x274C
		|| x === 0x274E
		|| x >= 0x2753 && x <= 0x2755
		|| x === 0x2757
		|| x >= 0x2795 && x <= 0x2797
		|| x === 0x27B0
		|| x === 0x27BF
		|| x === 0x2B1B
		|| x === 0x2B1C
		|| x === 0x2B50
		|| x === 0x2B55
		|| x >= 0x2E80 && x <= 0x2E99
		|| x >= 0x2E9B && x <= 0x2EF3
		|| x >= 0x2F00 && x <= 0x2FD5
		|| x >= 0x2FF0 && x <= 0x2FFF
		|| x >= 0x3001 && x <= 0x303E
		|| x >= 0x3041 && x <= 0x3096
		|| x >= 0x3099 && x <= 0x30FF
		|| x >= 0x3105 && x <= 0x312F
		|| x >= 0x3131 && x <= 0x318E
		|| x >= 0x3190 && x <= 0x31E3
		|| x >= 0x31EF && x <= 0x321E
		|| x >= 0x3220 && x <= 0x3247
		|| x >= 0x3250 && x <= 0x4DBF
		|| x >= 0x4E00 && x <= 0xA48C
		|| x >= 0xA490 && x <= 0xA4C6
		|| x >= 0xA960 && x <= 0xA97C
		|| x >= 0xAC00 && x <= 0xD7A3
		|| x >= 0xF900 && x <= 0xFAFF
		|| x >= 0xFE10 && x <= 0xFE19
		|| x >= 0xFE30 && x <= 0xFE52
		|| x >= 0xFE54 && x <= 0xFE66
		|| x >= 0xFE68 && x <= 0xFE6B
		|| x >= 0x16FE0 && x <= 0x16FE4
		|| x === 0x16FF0
		|| x === 0x16FF1
		|| x >= 0x17000 && x <= 0x187F7
		|| x >= 0x18800 && x <= 0x18CD5
		|| x >= 0x18D00 && x <= 0x18D08
		|| x >= 0x1AFF0 && x <= 0x1AFF3
		|| x >= 0x1AFF5 && x <= 0x1AFFB
		|| x === 0x1AFFD
		|| x === 0x1AFFE
		|| x >= 0x1B000 && x <= 0x1B122
		|| x === 0x1B132
		|| x >= 0x1B150 && x <= 0x1B152
		|| x === 0x1B155
		|| x >= 0x1B164 && x <= 0x1B167
		|| x >= 0x1B170 && x <= 0x1B2FB
		|| x === 0x1F004
		|| x === 0x1F0CF
		|| x === 0x1F18E
		|| x >= 0x1F191 && x <= 0x1F19A
		|| x >= 0x1F200 && x <= 0x1F202
		|| x >= 0x1F210 && x <= 0x1F23B
		|| x >= 0x1F240 && x <= 0x1F248
		|| x === 0x1F250
		|| x === 0x1F251
		|| x >= 0x1F260 && x <= 0x1F265
		|| x >= 0x1F300 && x <= 0x1F320
		|| x >= 0x1F32D && x <= 0x1F335
		|| x >= 0x1F337 && x <= 0x1F37C
		|| x >= 0x1F37E && x <= 0x1F393
		|| x >= 0x1F3A0 && x <= 0x1F3CA
		|| x >= 0x1F3CF && x <= 0x1F3D3
		|| x >= 0x1F3E0 && x <= 0x1F3F0
		|| x === 0x1F3F4
		|| x >= 0x1F3F8 && x <= 0x1F43E
		|| x === 0x1F440
		|| x >= 0x1F442 && x <= 0x1F4FC
		|| x >= 0x1F4FF && x <= 0x1F53D
		|| x >= 0x1F54B && x <= 0x1F54E
		|| x >= 0x1F550 && x <= 0x1F567
		|| x === 0x1F57A
		|| x === 0x1F595
		|| x === 0x1F596
		|| x === 0x1F5A4
		|| x >= 0x1F5FB && x <= 0x1F64F
		|| x >= 0x1F680 && x <= 0x1F6C5
		|| x === 0x1F6CC
		|| x >= 0x1F6D0 && x <= 0x1F6D2
		|| x >= 0x1F6D5 && x <= 0x1F6D7
		|| x >= 0x1F6DC && x <= 0x1F6DF
		|| x === 0x1F6EB
		|| x === 0x1F6EC
		|| x >= 0x1F6F4 && x <= 0x1F6FC
		|| x >= 0x1F7E0 && x <= 0x1F7EB
		|| x === 0x1F7F0
		|| x >= 0x1F90C && x <= 0x1F93A
		|| x >= 0x1F93C && x <= 0x1F945
		|| x >= 0x1F947 && x <= 0x1F9FF
		|| x >= 0x1FA70 && x <= 0x1FA7C
		|| x >= 0x1FA80 && x <= 0x1FA88
		|| x >= 0x1FA90 && x <= 0x1FABD
		|| x >= 0x1FABF && x <= 0x1FAC5
		|| x >= 0x1FACE && x <= 0x1FADB
		|| x >= 0x1FAE0 && x <= 0x1FAE8
		|| x >= 0x1FAF0 && x <= 0x1FAF8
		|| x >= 0x20000 && x <= 0x2FFFD
		|| x >= 0x30000 && x <= 0x3FFFD;
}

function lookup_getCategory(x) {
	if (isAmbiguous(x)) return 'ambiguous';

	if (lookup_isFullWidth(x)) return 'fullwidth';

	if (
		x === 0x20A9
		|| x >= 0xFF61 && x <= 0xFFBE
		|| x >= 0xFFC2 && x <= 0xFFC7
		|| x >= 0xFFCA && x <= 0xFFCF
		|| x >= 0xFFD2 && x <= 0xFFD7
		|| x >= 0xFFDA && x <= 0xFFDC
		|| x >= 0xFFE8 && x <= 0xFFEE
	) {
		return 'halfwidth';
	}

	if (
		x >= 0x20 && x <= 0x7E
		|| x === 0xA2
		|| x === 0xA3
		|| x === 0xA5
		|| x === 0xA6
		|| x === 0xAC
		|| x === 0xAF
		|| x >= 0x27E6 && x <= 0x27ED
		|| x === 0x2985
		|| x === 0x2986
	) {
		return 'narrow';
	}

	if (lookup_isWide(x)) return 'wide';

	return 'neutral';
}



;// CONCATENATED MODULE: ./node_modules/get-east-asian-width/index.js


function validate(codePoint) {
	if (!Number.isSafeInteger(codePoint)) {
		throw new TypeError(`Expected a code point, got \`${typeof codePoint}\`.`);
	}
}

function eastAsianWidthType(codePoint) {
	validate(codePoint);

	return getCategory(codePoint);
}

function eastAsianWidth(codePoint, {ambiguousAsWide = false} = {}) {
	validate(codePoint);

	if (
		lookup_isFullWidth(codePoint)
		|| lookup_isWide(codePoint)
		|| (ambiguousAsWide && isAmbiguous(codePoint))
	) {
		return 2;
	}

	return 1;
}

// For Prettier. This doesn't count "ambiguous" characters or check for valid input.
// https://github.com/sindresorhus/get-east-asian-width/pull/6
const _isNarrowWidth = codePoint => !(isFullWidth(codePoint) || isWide(codePoint));

// EXTERNAL MODULE: ./node_modules/ora/node_modules/emoji-regex/index.js
var emoji_regex = __nccwpck_require__(4128);
;// CONCATENATED MODULE: ./node_modules/ora/node_modules/string-width/index.js




function stringWidth(string, options = {}) {
	if (typeof string !== 'string' || string.length === 0) {
		return 0;
	}

	const {
		ambiguousIsNarrow = true,
		countAnsiEscapeCodes = false,
	} = options;

	if (!countAnsiEscapeCodes) {
		string = stripAnsi(string);
	}

	if (string.length === 0) {
		return 0;
	}

	let width = 0;

	for (const {segment: character} of new Intl.Segmenter().segment(string)) {
		const codePoint = character.codePointAt(0);

		// Ignore control characters
		if (codePoint <= 0x1F || (codePoint >= 0x7F && codePoint <= 0x9F)) {
			continue;
		}

		// Ignore combining characters
		if (codePoint >= 0x3_00 && codePoint <= 0x3_6F) {
			continue;
		}

		if (emoji_regex().test(character)) {
			width += 2;
			continue;
		}

		width += eastAsianWidth(codePoint, {ambiguousAsWide: !ambiguousIsNarrow});
	}

	return width;
}

;// CONCATENATED MODULE: ./node_modules/is-interactive/index.js
function isInteractive({stream = process.stdout} = {}) {
	return Boolean(
		stream && stream.isTTY &&
		process.env.TERM !== 'dumb' &&
		!('CI' in process.env)
	);
}

;// CONCATENATED MODULE: ./node_modules/ora/node_modules/is-unicode-supported/index.js


function is_unicode_supported_isUnicodeSupported() {
	if (external_node_process_namespaceObject.platform !== 'win32') {
		return external_node_process_namespaceObject.env.TERM !== 'linux'; // Linux console (kernel)
	}

	return Boolean(external_node_process_namespaceObject.env.WT_SESSION) // Windows Terminal
		|| Boolean(external_node_process_namespaceObject.env.TERMINUS_SUBLIME) // Terminus (<0.2.27)
		|| external_node_process_namespaceObject.env.ConEmuTask === '{cmd::Cmder}' // ConEmu and cmder
		|| external_node_process_namespaceObject.env.TERM_PROGRAM === 'Terminus-Sublime'
		|| external_node_process_namespaceObject.env.TERM_PROGRAM === 'vscode'
		|| external_node_process_namespaceObject.env.TERM === 'xterm-256color'
		|| external_node_process_namespaceObject.env.TERM === 'alacritty'
		|| external_node_process_namespaceObject.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm';
}

;// CONCATENATED MODULE: ./node_modules/stdin-discarder/index.js


const ASCII_ETX_CODE = 0x03; // Ctrl+C emits this code

class StdinDiscarder {
	#activeCount = 0;

	start() {
		this.#activeCount++;

		if (this.#activeCount === 1) {
			this.#realStart();
		}
	}

	stop() {
		if (this.#activeCount <= 0) {
			throw new Error('`stop` called more times than `start`');
		}

		this.#activeCount--;

		if (this.#activeCount === 0) {
			this.#realStop();
		}
	}

	#realStart() {
		// No known way to make it work reliably on Windows.
		if (external_node_process_namespaceObject.platform === 'win32' || !external_node_process_namespaceObject.stdin.isTTY) {
			return;
		}

		external_node_process_namespaceObject.stdin.setRawMode(true);
		external_node_process_namespaceObject.stdin.on('data', this.#handleInput);
		external_node_process_namespaceObject.stdin.unref();
	}

	#realStop() {
		if (!external_node_process_namespaceObject.stdin.isTTY) {
			return;
		}

		external_node_process_namespaceObject.stdin.setRawMode(false);
		external_node_process_namespaceObject.stdin.off('data', this.#handleInput);
	}

	#handleInput(chunk) {
		// Allow Ctrl+C to gracefully exit.
		if (chunk[0] === ASCII_ETX_CODE) {
			external_node_process_namespaceObject.emit('SIGINT');
		}
	}
}

const stdinDiscarder = new StdinDiscarder();

/* harmony default export */ const stdin_discarder = (stdinDiscarder);

;// CONCATENATED MODULE: ./node_modules/ora/index.js











class Ora {
	#linesToClear = 0;
	#isDiscardingStdin = false;
	#lineCount = 0;
	#frameIndex = 0;
	#options;
	#spinner;
	#stream;
	#id;
	#initialInterval;
	#isEnabled;
	#isSilent;
	#indent;
	#text;
	#prefixText;
	#suffixText;

	color;

	constructor(options) {
		if (typeof options === 'string') {
			options = {
				text: options,
			};
		}

		this.#options = {
			color: 'cyan',
			stream: external_node_process_namespaceObject.stderr,
			discardStdin: true,
			hideCursor: true,
			...options,
		};

		// Public
		this.color = this.#options.color;

		// It's important that these use the public setters.
		this.spinner = this.#options.spinner;

		this.#initialInterval = this.#options.interval;
		this.#stream = this.#options.stream;
		this.#isEnabled = typeof this.#options.isEnabled === 'boolean' ? this.#options.isEnabled : isInteractive({stream: this.#stream});
		this.#isSilent = typeof this.#options.isSilent === 'boolean' ? this.#options.isSilent : false;

		// Set *after* `this.#stream`.
		// It's important that these use the public setters.
		this.text = this.#options.text;
		this.prefixText = this.#options.prefixText;
		this.suffixText = this.#options.suffixText;
		this.indent = this.#options.indent;

		if (external_node_process_namespaceObject.env.NODE_ENV === 'test') {
			this._stream = this.#stream;
			this._isEnabled = this.#isEnabled;

			Object.defineProperty(this, '_linesToClear', {
				get() {
					return this.#linesToClear;
				},
				set(newValue) {
					this.#linesToClear = newValue;
				},
			});

			Object.defineProperty(this, '_frameIndex', {
				get() {
					return this.#frameIndex;
				},
			});

			Object.defineProperty(this, '_lineCount', {
				get() {
					return this.#lineCount;
				},
			});
		}
	}

	get indent() {
		return this.#indent;
	}

	set indent(indent = 0) {
		if (!(indent >= 0 && Number.isInteger(indent))) {
			throw new Error('The `indent` option must be an integer from 0 and up');
		}

		this.#indent = indent;
		this.#updateLineCount();
	}

	get interval() {
		return this.#initialInterval ?? this.#spinner.interval ?? 100;
	}

	get spinner() {
		return this.#spinner;
	}

	set spinner(spinner) {
		this.#frameIndex = 0;
		this.#initialInterval = undefined;

		if (typeof spinner === 'object') {
			if (spinner.frames === undefined) {
				throw new Error('The given spinner must have a `frames` property');
			}

			this.#spinner = spinner;
		} else if (!is_unicode_supported_isUnicodeSupported()) {
			this.#spinner = cli_spinners.line;
		} else if (spinner === undefined) {
			// Set default spinner
			this.#spinner = cli_spinners.dots;
		} else if (spinner !== 'default' && cli_spinners[spinner]) {
			this.#spinner = cli_spinners[spinner];
		} else {
			throw new Error(`There is no built-in spinner named '${spinner}'. See https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json for a full list.`);
		}
	}

	get text() {
		return this.#text;
	}

	set text(value = '') {
		this.#text = value;
		this.#updateLineCount();
	}

	get prefixText() {
		return this.#prefixText;
	}

	set prefixText(value = '') {
		this.#prefixText = value;
		this.#updateLineCount();
	}

	get suffixText() {
		return this.#suffixText;
	}

	set suffixText(value = '') {
		this.#suffixText = value;
		this.#updateLineCount();
	}

	get isSpinning() {
		return this.#id !== undefined;
	}

	#getFullPrefixText(prefixText = this.#prefixText, postfix = ' ') {
		if (typeof prefixText === 'string' && prefixText !== '') {
			return prefixText + postfix;
		}

		if (typeof prefixText === 'function') {
			return prefixText() + postfix;
		}

		return '';
	}

	#getFullSuffixText(suffixText = this.#suffixText, prefix = ' ') {
		if (typeof suffixText === 'string' && suffixText !== '') {
			return prefix + suffixText;
		}

		if (typeof suffixText === 'function') {
			return prefix + suffixText();
		}

		return '';
	}

	#updateLineCount() {
		const columns = this.#stream.columns ?? 80;
		const fullPrefixText = this.#getFullPrefixText(this.#prefixText, '-');
		const fullSuffixText = this.#getFullSuffixText(this.#suffixText, '-');
		const fullText = ' '.repeat(this.#indent) + fullPrefixText + '--' + this.#text + '--' + fullSuffixText;

		this.#lineCount = 0;
		for (const line of stripAnsi(fullText).split('\n')) {
			this.#lineCount += Math.max(1, Math.ceil(stringWidth(line, {countAnsiEscapeCodes: true}) / columns));
		}
	}

	get isEnabled() {
		return this.#isEnabled && !this.#isSilent;
	}

	set isEnabled(value) {
		if (typeof value !== 'boolean') {
			throw new TypeError('The `isEnabled` option must be a boolean');
		}

		this.#isEnabled = value;
	}

	get isSilent() {
		return this.#isSilent;
	}

	set isSilent(value) {
		if (typeof value !== 'boolean') {
			throw new TypeError('The `isSilent` option must be a boolean');
		}

		this.#isSilent = value;
	}

	frame() {
		const {frames} = this.#spinner;
		let frame = frames[this.#frameIndex];

		if (this.color) {
			frame = source[this.color](frame);
		}

		this.#frameIndex = ++this.#frameIndex % frames.length;
		const fullPrefixText = (typeof this.#prefixText === 'string' && this.#prefixText !== '') ? this.#prefixText + ' ' : '';
		const fullText = typeof this.text === 'string' ? ' ' + this.text : '';
		const fullSuffixText = (typeof this.#suffixText === 'string' && this.#suffixText !== '') ? ' ' + this.#suffixText : '';

		return fullPrefixText + frame + fullText + fullSuffixText;
	}

	clear() {
		if (!this.#isEnabled || !this.#stream.isTTY) {
			return this;
		}

		this.#stream.cursorTo(0);

		for (let index = 0; index < this.#linesToClear; index++) {
			if (index > 0) {
				this.#stream.moveCursor(0, -1);
			}

			this.#stream.clearLine(1);
		}

		if (this.#indent || this.lastIndent !== this.#indent) {
			this.#stream.cursorTo(this.#indent);
		}

		this.lastIndent = this.#indent;
		this.#linesToClear = 0;

		return this;
	}

	render() {
		if (this.#isSilent) {
			return this;
		}

		this.clear();
		this.#stream.write(this.frame());
		this.#linesToClear = this.#lineCount;

		return this;
	}

	start(text) {
		if (text) {
			this.text = text;
		}

		if (this.#isSilent) {
			return this;
		}

		if (!this.#isEnabled) {
			if (this.text) {
				this.#stream.write(`- ${this.text}\n`);
			}

			return this;
		}

		if (this.isSpinning) {
			return this;
		}

		if (this.#options.hideCursor) {
			cli_cursor.hide(this.#stream);
		}

		if (this.#options.discardStdin && external_node_process_namespaceObject.stdin.isTTY) {
			this.#isDiscardingStdin = true;
			stdin_discarder.start();
		}

		this.render();
		this.#id = setInterval(this.render.bind(this), this.interval);

		return this;
	}

	stop() {
		if (!this.#isEnabled) {
			return this;
		}

		clearInterval(this.#id);
		this.#id = undefined;
		this.#frameIndex = 0;
		this.clear();
		if (this.#options.hideCursor) {
			cli_cursor.show(this.#stream);
		}

		if (this.#options.discardStdin && external_node_process_namespaceObject.stdin.isTTY && this.#isDiscardingStdin) {
			stdin_discarder.stop();
			this.#isDiscardingStdin = false;
		}

		return this;
	}

	succeed(text) {
		return this.stopAndPersist({symbol: log_symbols.success, text});
	}

	fail(text) {
		return this.stopAndPersist({symbol: log_symbols.error, text});
	}

	warn(text) {
		return this.stopAndPersist({symbol: log_symbols.warning, text});
	}

	info(text) {
		return this.stopAndPersist({symbol: log_symbols.info, text});
	}

	stopAndPersist(options = {}) {
		if (this.#isSilent) {
			return this;
		}

		const prefixText = options.prefixText ?? this.#prefixText;
		const fullPrefixText = this.#getFullPrefixText(prefixText, ' ');

		const symbolText = options.symbol ?? ' ';

		const text = options.text ?? this.text;
		const fullText = (typeof text === 'string') ? ' ' + text : '';

		const suffixText = options.suffixText ?? this.#suffixText;
		const fullSuffixText = this.#getFullSuffixText(suffixText, ' ');

		const textToWrite = fullPrefixText + symbolText + fullText + fullSuffixText + '\n';

		this.stop();
		this.#stream.write(textToWrite);

		return this;
	}
}

function ora(options) {
	return new Ora(options);
}

async function oraPromise(action, options) {
	const actionIsFunction = typeof action === 'function';
	const actionIsPromise = typeof action.then === 'function';

	if (!actionIsFunction && !actionIsPromise) {
		throw new TypeError('Parameter `action` must be a Function or a Promise');
	}

	const {successText, failText} = typeof options === 'object'
		? options
		: {successText: undefined, failText: undefined};

	const spinner = ora(options).start();

	try {
		const promise = actionIsFunction ? action(spinner) : action;
		const result = await promise;

		spinner.succeed(
			successText === undefined
				? undefined
				: (typeof successText === 'string' ? successText : successText(result)),
		);

		return result;
	} catch (error) {
		spinner.fail(
			failText === undefined
				? undefined
				: (typeof failText === 'string' ? failText : failText(error)),
		);

		throw error;
	}
}



// EXTERNAL MODULE: ./node_modules/semver/index.js
var semver = __nccwpck_require__(1383);
var semver_default = /*#__PURE__*/__nccwpck_require__.n(semver);
// EXTERNAL MODULE: external "path"
var external_path_ = __nccwpck_require__(1017);
var external_path_default = /*#__PURE__*/__nccwpck_require__.n(external_path_);
;// CONCATENATED MODULE: ./src/main.ts







const binaries = {
    darwin: 'cloudquery_darwin_amd64',
    linux: 'cloudquery_linux_amd64',
};
const resolveDownloadUrl = async (version, binary) => {
    const tag = version.startsWith('v') ? `cli-${version}` : `cli-v${version}`;
    return `https://github.com/cloudquery/cloudquery/releases/download/${tag}/${binary}`;
};
const installBinary = async (version) => {
    const binary = binaries[(0,external_os_.platform)()];
    if (!binary) {
        throw new Error(`Unsupported platform: ${(0,external_os_.platform)()}`);
    }
    const message = `version '${source.green(version)}'`;
    const spinner = ora(`Downloading ${message} of CloudQuery`).start();
    const downloadUrl = await resolveDownloadUrl(version, binary);
    await execaCommand(`curl -L ${downloadUrl} -o cloudquery`, {
        stdout: 'inherit',
    });
    await execaCommand('chmod +x cloudquery');
    core.addPath(external_path_default().resolve('./'));
    spinner.succeed(`Finished downloading ${message} of CloudQuery`);
};
async function main_main() {
    try {
        const version = core.getInput('version', { required: false });
        if (!semver_default().valid(version)) {
            throw new Error(`Invalid version: ${version}`);
        }
        await installBinary(version);
    }
    catch (err) {
        const error = err;
        core.error(error);
        core.setFailed(error.message);
    }
}
main_main();

})();

var __webpack_exports__installBinary = __webpack_exports__.B;
export { __webpack_exports__installBinary as installBinary };
