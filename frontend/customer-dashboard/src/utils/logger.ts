import log from "loglevel";
import {dev} from "@/lib/config";

log.setLevel(dev ? "warn" : "debug");

export default log;