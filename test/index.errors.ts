import { fromITUCode, fromISOCode } from '../dist'

// THROWS Argument of type 'null' is not assignable to parameter of type 'string | number'.
fromITUCode(null)

// THROWS Argument of type 'null' is not assignable to parameter of type 'string'.
fromISOCode(null)
