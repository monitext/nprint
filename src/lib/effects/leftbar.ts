import { cols } from "../cols/colorPack"
import { ChalkStyleKeys } from "../cols/colorPolify"

const bar = "│"

export function leftbar(str: string){
    return str.trim().split("\n").map(s => `${bar} ${s}`).join("\n")
}

console.log(leftbar(`
Welcome to fish, the friendly interactive shell
Type help for instructions on how to use fish
`))