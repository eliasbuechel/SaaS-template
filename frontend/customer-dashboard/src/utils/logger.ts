import log, {LogLevelDesc} from "loglevel";

const NEXT_PUBLIC_LOG_LEVEL: string = process.env.NEXT_PUBLIC_LOG_LEVEL || "info";

const levelColors: Record<string, string> = {
    trace: "color: gray",
    debug: "color: blue",
    info: "color: green",
    warn: "color: orange",
    error: "color: red; font-weight: bold",
};

const originalFactory = log.methodFactory;
log.methodFactory = function (methodName, logLevel, loggerName) {
    const rawMethod = originalFactory(methodName, logLevel, loggerName);
    return function (...messages: any[]) {
        const color = levelColors[methodName] || "color: black";
        rawMethod(`%c${methodName}: `, color, ...messages);
    };
};

log.setLevel(NEXT_PUBLIC_LOG_LEVEL as LogLevelDesc);

export default log;