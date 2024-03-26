import {fromITUCode, fromISOCode} from "../lib";

// THROWS Argument of type 'null' is not assignable to parameter of type 'string | number'.
fromITUCode(null);

// THROWS Argument of type 'null' is not assignable to parameter of type 'string'.
fromISOCode(null);
